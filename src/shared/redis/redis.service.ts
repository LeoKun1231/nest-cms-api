// redis.service.ts

import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { EnvEnum } from "../enums/env.enum";
import { AppLoggerSevice } from "../logger/logger.service";

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: AppLoggerSevice,
	) {
		super({
			port: configService.get(EnvEnum.REDIS_PORT),
			host: configService.get(EnvEnum.REDIS_HOST),
			password: configService.get(EnvEnum.REDIS_PASSWORD),
		});
		this.logger.setContext(RedisService.name);
	}

	async onModuleInit() {
		this.logger.log("redis connect success");
		await this.ping();
	}
}
