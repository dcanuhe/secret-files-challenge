FROM node:16-alpine

EXPOSE 8080

ARG REACT_APP_API_URL localhost:3000

RUN apk add darkhttpd

USER node

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install
RUN npm run build

CMD ["darkhttpd", "build/", "--port", "8080"]
