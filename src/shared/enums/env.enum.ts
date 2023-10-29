/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 19:32:39
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-21 20:27:34
 * @FilePath: \cms\src\shared\enums\env.enum.ts
 * @Description:
 */
export enum EnvEnum {
  APP_ENV = 'APP_ENV',
  APP_PORT = 'APP_PORT',

  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_DATABASE = 'DB_DATABASE',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_SYNC = 'DB_SYNC',

  JWT_PUBLIC_KEY = 'JWT_PUBLIC_KEY',
  JWT_PRIVATE_KEY = 'JWT_PRIVATE_KEY',
  JWT_ACCESS_TOKEN_EXPIRES_IN = 'JWT_ACCESS_TOKEN_EXPIRES_IN',
  JWT_REFRESH_TOKEN_EXPIRES_IN = 'JWT_REFRESH_TOKEN_EXPIRES_IN',
}
