# 写在前面

1. 该项目有两个版本一个是prisma版本，一个是typeorm版本，你可以切换分支，master分支是typeorm版本，这边推荐使用prisma版本(我会优先修复prisma版本)，因为typeorm版本的代码可能会比较乱，所以这边推荐使用typeorm版本。
2. 该项目是cms的后端项目，具体前端代码在<a href="https://github.com/LeoKun1231/VUE3-CMS-TS-PINIA">VUE3-CMS-TS-PINIA</a>，<a href="https://vue3-cms.hqk10.xyz">在这里可以访问体验网站</a>。具体后端接口可以看<a href="https://apifox.com/apidoc/shared-ede0e4ad-7f38-42fd-a749-3c8df4d8b7ba">apifox</a>里的接口。
3. 这边推荐使用docker-compose进行环境搭建，如果你是windows,你可能需要使用WSL，如果不使用docker-compose，需要自行安装mysql、redis。

   ```bash
   # 如果你有安装docker，且不介意JWT公钥私钥，你只需执行下面的命令即可运行项目。
   $ docker compose up -d
   ```

4. jwt所需要使用的公钥和私钥，需要自行生成，并且在.env.\*文件中配置，如果不想则直接使用默认的即可。
5. 具体操作步骤，请看后面的安装步骤。
6. 如果有什么问题，可以在issue中提出，我会尽快回复。

## 技术栈

|     |            | 技术栈  | 描述 |
| --- | ---------- | ------- | ---- |
| 1   | 后端框架   | nest    | 完成 |
| 2   | 数据库     | mysql   | 完成 |
| 3   | orm        | prisma  | 完成 |
| 4   | redis      | ioredis | 完成 |
| 5   | docker     | docker  | 完成 |
| 6   | 日志       | winston | 完成 |
| 7   | 编译器     | swc     | 完成 |
| 8   | 鉴权       | jwt     | 完成 |
| 9   | rbac       | rbac    | 完成 |
| 10  | 二维码登录 | qrcode  | 完成 |
| ... | ...        | ...     | ...  |

## 安装

推荐直接使用pnpm进行安装，如果没有安装pnpm，可以使用npm进行安装。

```bash
pnpm install
```

## 生成jwt的公钥和私钥

### 1.通过docker生成脚本

```bash
./scripts/generate-jwt-keys
```

将输出类似于此的内容。 您只需要将其添加到.env文件中。

```
为了设置JWT密钥，请将以下值添加到.env文件中：
JWT_PUBLIC_KEY_BASE64="(long base64 content)"
JWT_PRIVATE_KEY_BASE64="(long base64 content)"
```

### 2.不通过docker生成脚本

```bash
$ cd local
$ ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
# Don't add passphrase
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

你应该这些密钥文件保存在`./local`目录中，并使用base64编码密钥：

```bash
base64 -i local/jwtRS256.key

base64 -i local/jwtRS256.key.pub
```

必须在.env中输入密钥文件的base64：

```bash
JWT_PUBLIC_KEY_BASE64=这里填入经过base64编码的公钥
JWT_PRIVATE_KEY_BASE64=这里填入经过base64编码的私钥
```

## 运行项目

你可以使用docker运行项目，也可以不使用docker运行项目。
这边建议使用docker-compose进行运行，如果不使用docker-compose，需要自行安装mysql、redis。

### 1.不使用docker运行

为了运行不使用Docker的服务器，我们需要这个前提条件：

- 那就是你需要安装mysql、redis。

```bash
# watch mode 它将使用swc编译器进行编译 非常的快
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

### 2.使用docker运行

直接使用docker-compose进行运行即可(推荐)

```bash
docker compose up -d
```

如果不想使用docker-compose，可以使用下面的命令进行运行(这种方法也需要手动安装redis和Mysql)。

```bash

# build image
$ docker build -t my-app .

$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app  --env-file .env.development my-app
```

## prisma操作

具体见<a href="https://www.prisma.io/docs/concepts/components/prisma-client/crud">prisma官网</a>
