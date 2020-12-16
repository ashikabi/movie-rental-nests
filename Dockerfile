FROM node:alpine
WORKDIR "/app"`
COPY ./package.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN yarn prebuild
RUN yarn build
CMD ["yarn", "start:prod"]