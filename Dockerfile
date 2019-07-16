FROM node:12-alpine

WORKDIR /usr/src/app

ENV TOKEN="NjAwMDM2MjA4OTY5NjQ2MTIw.XS5R-A.0kIUGezpFcZBtdXCwsikvpoyK7w" \
    OWNER="281193735788953601" \
    PREFIX="+" \
    NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

COPY . .
CMD ["yarn", "start"]