# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node:18 as builder

WORKDIR /usr/src/app
RUN echo "Clear cache"

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install 

COPY . .

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}


RUN pnpm run build

RUN pnpm prune

FROM node:18 

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/dist ./dist


EXPOSE 3000

USER node
CMD [ "npm","run", "start:prod"]
