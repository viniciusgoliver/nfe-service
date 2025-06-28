FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libxml2-dev \
  openssl

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma/
RUN yarn prisma generate

COPY . .

RUN yarn build

RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:20-slim

RUN apt-get update && apt-get install -y libxml2 openssl && apt-get clean

WORKDIR /app

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/schemas ./schemas
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV LISTEN_PORT=3000
EXPOSE 3000

CMD [ "yarn", "start:prod" ]