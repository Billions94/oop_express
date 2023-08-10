FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install ts-node-dev
RUN npm install express-api-cache
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]