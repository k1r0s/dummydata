FROM node:stretch-slim

WORKDIR /app

COPY local_modules ./local_modules
COPY package.json .

RUN npm install

COPY index.js .

RUN mkdir persistancefs

EXPOSE 80
CMD [ "node", "index.js" ]
