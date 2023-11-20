# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node:18 as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm config set registry https://registry.npmmirror.com/

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


WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist


EXPOSE 3000


CMD [ "npm","run", "start:prod"]
