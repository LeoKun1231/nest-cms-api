# 写在前面

1. 该项目是cms的后端项目，增加了一部分功能，具体可以看apifox的接口。
2. 这边推荐使用docker-compose进行环境搭建，如果不使用docker-compose，需要自行安装mysql、redis。jwt所需要使用的公钥和私钥，需要自行生成，并且在.env.\*文件中配置，如果不想则直接使用默认的即可。
3. 具体操作步骤，请看后面的安装步骤。
4. 如果有什么问题，可以在issue中提出，我会尽快回复。

## 技术栈

|     |          | 技术栈  | 描述 |
| --- | -------- | ------- | ---- |
| 1   | 后端框架 | nest    | 完成 |
| 2   | 数据库   | mysql   | 完成 |
| 3   | orm      | typeorm | 完成 |
| 4   | redis    | ioredis | 完成 |
| 5   | docker   | docker  | 完成 |
| 6   | 日志     | winston | 完成 |
| 7   | 编译器   | swc     | 完成 |
| 8   | 鉴权     | jwt     | 完成 |
| 9   | rbac     | rbac    | 完成 |
| 10  | husky    | husky   | 完成 |
| ... | ...      | ...     | ...  |

## Installation

```bash
$ pnpm install
```

### With docker

Run this command:

```bash
./scripts/generate-jwt-keys
```

It will output something like this. You only need to add it to your `.env` file.

```
To setup the JWT keys, please add the following values to your .env file:
JWT_PUBLIC_KEY_BASE64="(long base64 content)"
JWT_PRIVATE_KEY_BASE64="(long base64 content)"
```

### Without docker

```bash
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

You may save these key files in `./local` directory as it is ignored in git.

Encode keys to base64:

```bash
$ base64 -i local/jwtRS256.key

$ base64 -i local/jwtRS256.key.pub
```

Must enter the base64 of the key files in `.env`:

```bash
JWT_PUBLIC_KEY_BASE64=BASE64_OF_JWT_PUBLIC_KEY
JWT_PRIVATE_KEY_BASE64=BASE64_OF_JWT_PRIVATE_KEY
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- mysql server running

Commands:

<b>after pnpm start:dev,you should execute sql/all.sql.</b>

```bash
# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network mynetwork --env-file .env.development my-app

# run docker-compose
$ docker compose up
```

## Migrations

generate migration (replace users with name of the migration)

```bash
$ npm_config_name=users pnpm migration:generate

# run migration
$ pnpm migration:run

# revert migration
$ pnpm migration:revert
```
