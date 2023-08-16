FROM node:slim as base
WORKDIR /app

FROM base as test
COPY . /app
RUN npm install
EXPOSE 8080
RUN npm run test

FROM base as prod
COPY . /app
RUN npm install
EXPOSE 8080
CMD npm run serve
