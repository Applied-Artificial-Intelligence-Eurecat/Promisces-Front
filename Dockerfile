FROM nginx:stable-alpine
COPY ./dist/promisces-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
