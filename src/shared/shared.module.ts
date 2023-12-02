/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-29 09:25:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-13 22:01:36
 * @FilePath: \cms\src\shared\shared.module.ts
 * @Description:
 */
import {
	Global,
	Logger,
	MiddlewareConsumer,
	Module,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { loadEnvConfig, validationSchema } from "./config";
import { AllExceptionsFilter } from "./filters";
import { JwtAccessGuard, PermissionAuthGuard } from "./guards";
import { TransformResultInterceptor } from "./interceptors";
import { LoggerModule } from "./logger";
import { LogMiddleware } from "./middleware";
import { PrismaModule } from "./prisma";
import { RedisModule } from "./redis";
import { SharedService } from "./shared.service";
import { UploadModule } from "./upload";
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath,
			validationSchema,
			isGlobal: true,
			load: [loadEnvConfig],
		}),
		UploadModule,
		RedisModule,
		PrismaModule,
		LoggerModule,

		ThrottlerModule.forRoot({
			throttlers: [
				{
					//每秒最多请求10次
					ttl: 1000,
					limit: 10,
				},
			],
		}),
	],
	providers: [
		SharedService,
		Logger,
		//全局异常拦截器
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		//全局响应结果过滤
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformResultInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAccessGuard,
		},
		//全部权限守卫
		{
			provide: APP_GUARD,
			useClass: PermissionAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
	exports: [SharedService, Logger, LoggerModule, RedisModule, PrismaModule],
})

//配置请求日志中间件
export class SharedModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LogMiddleware)
			.forRoutes(
				{ path: "*", method: RequestMethod.ALL },
				{ path: "/", method: RequestMethod.ALL },
			);
	}
}
