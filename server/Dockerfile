FROM node:14

COPY ./src ./src
COPY .babelrc package-lock.json package.json tsconfig.json ./

RUN npm ci
RUN npm run build:js

EXPOSE 5000
ENTRYPOINT ["node", "./lib/index.js"]