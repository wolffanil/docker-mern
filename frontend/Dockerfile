FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=4096"


RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

