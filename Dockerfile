FROM node:9.2.0-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY index.js .
COPY config.json .
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone \
    && echo '5,15,25,35,45,55 * * * * cd /usr/src/app; node index.js' > crontab.tmp \
    && crontab crontab.tmp \
    && rm -f crontab.tmp
CMD ["/usr/sbin/crond", "-f", "-d", "0"]
