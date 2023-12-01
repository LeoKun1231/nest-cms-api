import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisKeyEnum } from "../enums";
import { AppLoggerSevice } from "../logger";
import { RedisService } from "../redis";
import { filterEmpty } from "../utils";

//我目前没有可以优化的想法，你可以自己实现

const redisService = new RedisService(
	new ConfigService(),
	new AppLoggerSevice(new Logger()),
);

export const Cacheable = (key: RedisKeyEnum) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			let cacheKey = "";
			if (args.length === 0) {
				cacheKey = `${key}:${propertyKey}`;
			} else {
				cacheKey = `${key}:${propertyKey}:${JSON.stringify(
					args.map((arg) => filterEmpty(arg)),
				)}`;
			}
			const cacheValue = await redisService._get(cacheKey);
			if (cacheValue) {
				return cacheValue;
			}
			const result = await originalMethod.apply(this, args);
			redisService._set(cacheKey, result);
			return result;
		};
	};
};

export const CachePut = (key: RedisKeyEnum) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const result = await originalMethod.apply(this, args);
			redisService._set(key, result);
			return result;
		};
	};
};

export const CacheEvict = (...keys: RedisKeyEnum[]) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const result = await originalMethod.apply(this, args);
			Promise.all(
				keys.map(async (key) => {
					await redisService._delKeysWithPrefix(key);
				}),
			);
			return result;
		};
	};
};
