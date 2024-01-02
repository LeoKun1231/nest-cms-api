/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-18 19:38:46
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:35:40
 * @FilePath: \cms\src\shared\config\loadEnv.config.ts
 * @Description:
 */
import * as dotebnv from "dotenv";
import { EnvEnum } from "../enums/env.enum";

dotebnv.config({ path: `.env.${process.env.NODE_ENV}` });

export const loadEnvConfig = (): Record<EnvEnum, unknown> => {
	return {
		APP_ENV: process.env.APP_ENV,
		APP_PORT: process.env.APP_PORT,
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
		JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
		JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
		JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
		LOG_LEVEL: process.env.LOG_LEVEL,
		TIMESTAMP: process.env.TIMESTAMP,
		LOG_ON: process.env.LOG_ON,
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PASSWORD: process.env.REDIS_PASSWORD,
		REDIS_PORT: process.env.REDIS_PORT,
		UPLOAD_ADDRESS: process.env.UPLOAD_ADDRESS,
	};
};
