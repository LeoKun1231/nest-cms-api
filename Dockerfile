#prisma问题 不使用alpine
FROM node:18 AS development

#指定工作目录
WORKDIR /usr/src/app

#复制package.json和pnpm-lock.yaml 到工作目录 这里单独复制是为了利用缓存
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g pnpm

RUN pnpm install 

RUN pnpx prisma generate

COPY . .

#设置默认环境变量
ARG APP_ENV=development
#暴露环境变量
ENV NODE_ENV=${APP_ENV}

RUN pnpm build


FROM node:18  AS production


ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

#指定工作目录
WORKDIR /usr/src/app


RUN npm install -g pnpm

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/dist ./dist


EXPOSE 3000


CMD ["node", "dist/main"]
