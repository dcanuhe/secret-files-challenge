FROM node:14-alpine

EXPOSE 3000

USER node

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install

CMD ["npm", "start"]
