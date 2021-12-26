FROM node:17.3.0-alpine

WORKDIR /usr/src/app
COPY index.js package*.json ./
RUN npm install --only=production

CMD [ "node", "index.js" ]