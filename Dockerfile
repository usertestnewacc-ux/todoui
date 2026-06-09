FROM node:22-alpine AS build
 
WORKDIR /app
 
COPY package.json ./
 
RUN npm install
 
COPY . ./
 
RUN npm run build
 
FROM nginx:alpine AS serve
 
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
COPY --from=build /app/dist/todui/browser /usr/share/nginx/html
# At container start, rewrite any hard-coded localhost API URLs in the built JS
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]