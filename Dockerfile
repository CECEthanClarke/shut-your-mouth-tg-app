FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_ID= \
    APP_HASH= \
    MODE=FULL_DELETE_MODE \
    DELAY_DELETION_SECONDS=0

CMD ["node", "index.js"]