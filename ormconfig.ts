/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 19:39:56
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 16:49:36
 * @FilePath: \cms\ormconfig.ts
 * @Description:
 */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvEnum } from './src/shared/enums/env.enum';
import loadEnvConfig from '@/shared/config/loadEnv.config';

// 通过dotENV来解析不同的配置
export function buildConnectionOptions() {
  const config = loadEnvConfig();
  const entitiesDir = [__dirname + '/**/*.entity{.ts,.js}'];
  return {
    type: 'mysql',
    host: config[EnvEnum.DB_HOST],
    port: config[EnvEnum.DB_PORT],
    username: config[EnvEnum.DB_USERNAME],
    password: config[EnvEnum.DB_PASSWORD],
    database: config[EnvEnum.DB_DATABASE],
    entities: entitiesDir,
    synchronize: config[EnvEnum.DB_SYNC],
    dateStrings: true,
    logging:
      process.env.NODE_ENV !== 'development' ? 'file' : ['query', 'error'],
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['migrations/**'],
  subscribers: [],
} as DataSourceOptions);
