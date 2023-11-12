import * as Joi from "joi";
import { EnvEnum } from "../enums/env.enum";
export const validationSchema = Joi.object({
	DB_PORT: Joi.number().default(3306),
	DB_HOST: Joi.string().required(),
	DB_USERNAME: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_SYNC: Joi.boolean().default(false),
	APP_ENV: Joi.string()
		.valid("development", "production")
		.default("development"),
	APP_PORT: Joi.number().default(3000),
	JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default("1h"),
	JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default("7d"),
	JWT_PRIVATE_KEY: Joi.string().required(),
	JWT_PUBLIC_KEY: Joi.string().required(),
} as Record<EnvEnum, Joi.Schema>);
