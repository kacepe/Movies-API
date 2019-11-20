FROM node:12
EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

CMD ["npm", "start"]
