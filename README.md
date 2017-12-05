# Udemy Notify

A simple Node.js app that reads RSS feed from http://www.onlinecoursesupdate.com/ and sends notifications to users via [LINE Notify API](https://notify-bot.line.me/doc/en/).

## Installation
```bash
git clone https://github.com/suksit/udemy-notify.git
cd udemy-notify
npm install
```

## Configuration
Create ```config.json``` from the template:
```bash
cp config.json.example config.json
```
Then put LINE Notify access token(s) in ```config.json```. The ```name``` field is just a reminder and can be anything. For example,

```json
{
  "tokens": [
    {
      "name": "me",
      "value": "ulzku7sSCbd09sP163Yc4Dk4tOAQKj9UMpNTqY1bzll"
    },
    {
      "name": "some group",
      "value": "ab7e19UMpNTqY1bz5l0POs163Yc4DAQk4tSCbd09sKj"
    }
  ],
  "lastUpdate": "0000-00-00T00:00:00.000Z"
}
```

## Usage
One-time execution:
```bash
node index.js
```
Crontab with Docker:
```bash
docker build -t udemy-notify .
docker run -d --name udemy_notify udemy-notify
