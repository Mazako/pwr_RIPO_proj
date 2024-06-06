FROM node:22-alpine
RUN apk add xsel

COPY ./public /app/public
COPY ./src /app/src
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./tsconfig.json /app

WORKDIR /app

RUN npm install -g serve
RUN npm i
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["serve", "-s", "build"]
