FROM nginx:latest

COPY .vitepress/dist /usr/share/nginx/html

RUN chown nginx:nginx -R /usr/share/nginx/html

EXPOSE 80
