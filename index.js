const FeedParser = require('feedparser')
const request = require('request')
const moment = require('moment')
const fs = require('fs')

const config = require('./config.json')

const NOTIFY_URL = 'https://notify-api.line.me/api/notify'
const FEED_URL = 'http://www.onlinecoursesupdate.com/feeds/posts/default?alt=atom'

moment().utcOffset(7)

const req = request(FEED_URL)
const parser = new FeedParser()

req.on('error', function (err) {
  console.error(err)
})

req.on('response', function (res) {
  if (res.statusCode !== 200) {
    console.error('Bad status code')
  } else {
    res.pipe(parser)
  }
})

parser.on('error', function (err) {
  console.error(err)
})

parser.on('readable', function () {
  const item = this.read()

  if (item) {
    const pubdate = moment(item.pubdate)
    const lastUpdate = moment(config.lastUpdate)

    if (pubdate.isAfter(lastUpdate)) {
      config.tokens.forEach(function (token) {
        const title = item.title.replace('Udemy - ', '')

        const link = item['atom:link'].find(function (link) {
          return link['@'].rel === 'alternate'
        })['@'].href

        const postData = {
          url: NOTIFY_URL,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token.value}`
          },
          formData: {
            message: `${title}\r\n${link}`
          }
        }

        console.log(`sending notification to ${token.name}...`)

        request.post(postData, (err, res) => {
          if (err) {
            console.error(err)
          }
          console.log(res.body)
        })
      })
    }
  } else {
    config.lastUpdate = this.meta.date
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
  }
})
