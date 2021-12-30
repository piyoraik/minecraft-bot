FROM node:17.3.0-alpine AS base
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS dev
CMD [ "npm", "run", "dev" ]

FROM base AS build
RUN npm run tsc

FROM node:17.3.0-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /build/node_modules /usr/src/app/node_modules
COPY --from=build /build/dist /usr/src/app/dist
CMD [ "node", "dist/index.js" ]