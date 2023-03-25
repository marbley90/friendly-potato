FROM node:14

WORKDIR /usr/bin/friendly-potato

COPY package.json ./

RUN npm install

COPY . .

COPY .env ./.env

EXPOSE 3000 3000

RUN npm run build

CMD ["node", "dist/main.js"]
