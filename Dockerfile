FROM node:20-alpine as builder

WORKDIR /app

COPY dev.env ./.env

RUN yarn global add @nestjs/cli@11

COPY package*.json ./
COPY prisma ./prisma/
COPY templates ./templates/

RUN yarn

COPY . .

RUN yarn build
RUN yarn install --production

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.env ./.env
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/templates ./templates
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

ENV LISTEN_PORT=3001
EXPOSE 3001

ENV NODE_ENV=production

CMD [  "yarn", "start:prod" ]