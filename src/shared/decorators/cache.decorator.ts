import { RedisKeyEnum } from "../enums";
import { getGlobalApp } from "../global";
import { RedisService } from "../redis";
import { filterEmpty } from "../utils";

//我目前没有可以优化的想法，你可以自己实现

export const Cacheable = (...keys: RedisKeyEnum[]) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			let cacheKey = "";
			const redisService = getGlobalApp().get(RedisService);

			//如果没有参数，那么就是key:propertyKey
			if (args.length === 0) {
				//如果只有一个key，那么就是key:propertyKey
				if (keys.length === 1) {
					cacheKey = `${keys[0]}:${propertyKey}`;
				} else if (keys.length > 1) {
					//如果有多个key，那么就是key1:key2:propertyKey
					keys.forEach((key) => {
						cacheKey += `${key}:`;
					});
					cacheKey = cacheKey + propertyKey;
				}
			} else {
				//如果有参数，那么就是key:propertyKey:args
				if (keys.length === 1) {
					//如果只有一个key，那么就是key:propertyKey:args
					cacheKey = `${keys[0]}:${propertyKey}:${JSON.stringify(
						args.map((arg) => filterEmpty(arg)),
					)}`;
				} else if (keys.length > 1) {
					//如果有多个key，那么就是key1:key2:propertyKey:args
					keys.forEach((key) => {
						cacheKey += `${key}:`;
					});
					cacheKey =
						cacheKey +
						propertyKey +
						`:${JSON.stringify(args.map((arg) => filterEmpty(arg)))}`;
				}
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
			const redisService = getGlobalApp().get(RedisService);
			const result = await originalMethod.apply(this, args);
			redisService._set(key, result);
			return result;
		};
	};
};

//会删除所有包含key的缓存
export const CacheEvict = (...keys: RedisKeyEnum[]) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const redisService = getGlobalApp().get(RedisService);
			const result = await originalMethod.apply(this, args);
			keys.map(async (key) => {
				await redisService._delKeysContainStr(key);
			});
			return result;
		};
	};
};
