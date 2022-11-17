FROM node:18-alpine as build
WORKDIR /usr/app
COPY . .
COPY ./.env.prod ./.env
RUN yarn install && yarn build

FROM node:18-alpine
WORKDIR /usr/app
COPY ./.env.prod ./.env
COPY --from=build /usr/app/build .
COPY prisma .
COPY src/backend/package.json src/backend/package.json
COPY src/frontend/package.json src/frontend/package.json
COPY package.json .
RUN yarn install --prod
RUN yarn prisma generate
RUN npm i -g pm2
CMD yarn prisma migrate deploy && pm2-runtime index.js
