const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')

const config = require('./config.json')

const NOTIFY_URL = 'https://notify-api.line.me/api/notify'

const notify = function (item, url) {
  axios.get(url).then(function (res) {
    const $ = cheerio.load(res.data)
    const rating = $('.ratingValues').text().trim().replace('(', '').replace(')', '/5')
    const published = $('.rightaTopBoxPrice div:nth-child(6) div:nth-child(2)').text().trim()

    config.tokens.forEach(function (token) {
      const title = item.title
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
          message: `${title}\r\nRating: ${rating}\r\nLast updated: ${published}\r\n${link}`
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
  })
}

module.exports = {
  notify
}
