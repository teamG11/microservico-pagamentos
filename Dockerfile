# development

FROM node:18-alpine3.16 AS development-pagamentos

WORKDIR /usr/src/app

COPY package*.json .
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 3000

# build

FROM node:18-alpine3.16 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node prisma ./prisma/

COPY --chown=node:node --from=development-pagamentos /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production-pagamentos

# RUN npm run prisma:generate

USER node

# production

FROM node:18-alpine3.16 AS production-pagamentos

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/build ./build
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

CMD [ "npm", "run", "start:migrate:prod" ]
