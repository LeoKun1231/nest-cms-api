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

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

### Docker

```bash
# build image
$ docker network create mynetwork

$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network mynetwork --env-file .env.prodution my-app

# run using docker compose
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
