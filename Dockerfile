FROM node:9.2.0-alpine
COPY package.json /usr/src/app/
WORKDIR /usr/src/app/
RUN yarn
COPY index.js udemy.js eduonix.js config.json /usr/src/app/
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone \
    && echo '5,15,25,35,45,55 * * * * cd /usr/src/app; node index.js' > crontab.tmp \
    && crontab crontab.tmp \
    && rm -f crontab.tmp
CMD ["/usr/sbin/crond", "-f", "-d", "0"]
