# FROM node:21
FROM node:21-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

EXPOSE ${NODE_PORT}

CMD ["node", "app.js"]