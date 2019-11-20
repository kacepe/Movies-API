FROM node:12
EXPOSE ${SERVER_PORT}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

CMD ["npm", "start"]
