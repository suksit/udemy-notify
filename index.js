const FeedParser = require('feedparser')
const request = require('request')
const moment = require('moment')
const fs = require('fs')
const cheerio = require('cheerio')
const url = require('url')

const config = require('./config.json')
const udemy = require('./udemy')
const eduonix = require('./eduonix')

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
      const couponURL = item['atom:content']['#']
      const $ = cheerio.load(couponURL)
      const courseURL = $('.take-btn a').attr('href').split('?')[0]

      switch (url.parse(courseURL).hostname) {
        case 'www.udemy.com':
          udemy.notify(item, courseURL)
          break
        case 'www.eduonix.com':
          eduonix.notify(item, courseURL)
          break
      }
    }
  } else {
    config.lastUpdate = this.meta.date
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
  }
})
