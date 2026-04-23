FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY index.html ./index.html
COPY styles.css ./styles.css
COPY app.js ./app.js
COPY assets ./assets

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
