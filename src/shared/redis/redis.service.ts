/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 21:26:38
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:53:11
 * @FilePath: \cms\src\shared\redis\redis.service.ts
 * @Description:
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RecordTime } from "../decorators/record-time.decorator";
import { EnvEnum } from "../enums/env.enum";
import { AppLoggerSevice } from "../logger/logger.service";

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: AppLoggerSevice,
	) {
		super({
			port: configService.get(EnvEnum.REDIS_PORT),
			host: configService.get(EnvEnum.REDIS_HOST),
			password: configService.get(EnvEnum.REDIS_PASSWORD),
			lazyConnect: true,
		});

		this.logger.setContext(RedisService.name);
	}

	@RecordTime()
	async _get(key: string) {
		return JSON.parse(await this.get(key));
	}

	@RecordTime()
	async _setex(key: string, seconds: number, value: any) {}

	@RecordTime()
	async _set(key: string, value: any) {
		return await this.set(key, JSON.stringify(value));
	}

	@RecordTime()
	async _delKeysWithPrefix(prefix: string) {
		const keys = await this.keys(`${prefix}*`);
		if (keys.length === 0) {
			return 0;
		}
		return await this.del(...keys);
	}

	@RecordTime()
	async _delKeysContainStr(str: string) {
		const keys = await this.keys(`*${str}*`);
		if (keys.length === 0) {
			return 0;
		}
		return await this.del(...keys);
	}

	async onModuleInit() {
		await this.connect();
		//删除所有key
		this.flushall();
		this.logger.log("redis connect success ✅");
	}

	onModuleDestroy() {
		this.disconnect(false);
		this.logger.log("redis disconnect success ✅");
	}
}
