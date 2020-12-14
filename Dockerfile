FROM node:alpine
ARG REDIS_HOST
ENV REDIS_HOST=redis
ARG REDIS_PORT
ENV REDIS_PORT=6379
ARG MYSQL_HOST
ENV MYSQL_HOST=mysql
ARG MYSQL_PORT
ENV MYSQL_PORT=3306
ARG MYSQL_ROOT_PASSWORD
ENV MYSQL_ROOT_PASSWORD=!TestingDB20
ARG MYSQL_DATABASE
ENV MYSQL_DATABASE=movierental
ARG DB_USER
ENV DB_USER=root

WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
RUN yarn start:prod