const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')

const config = require('./config.json')

const NOTIFY_URL = 'https://notify-api.line.me/api/notify'

const notify = function (item, url) {
  axios.get(url).then(function (res) {
    const $ = cheerio.load(res.data)
    const rating = $('.rate-count .tooltip-container span').attr('aria-label').replace(' out of ', '/').replace('.0', '')
    const reviews = $('.rate-count .tooltip-container .tooltip')[0].prev.data.replace('\n', '').trim()
    const students = $('[data-purpose=enrollment]').first().text().replace('\n', '').replace(' enrolled', '').trim()
    const published = $('[data-purpose=last-update-date]').text().replace('ed', 'ed:').replace('\n', '').trim()

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
          message: `${title}\r\n${rating} ${reviews}\r\nPopularity: ${students}\r\n${published}\r\n${link}`
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
