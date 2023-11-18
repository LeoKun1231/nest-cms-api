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
import { TypeOrmModule } from "@nestjs/typeorm";
import { connectionParams } from "../ormconfig";
import loadEnvConfig from "./config/loadEnv.config";
import { validationSchema } from "./config/validateEnv.config";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { JwtAccessGuard } from "./guards/jwt-access.guard";
import { PermissionAuthGuard } from "./guards/permission-auth.guard";
import { TransformResultInterceptor } from "./interceptors/transform.interceptor";
import { LoggerModule } from "./logger/logger.module";
import { LogMiddleware } from "./middleware/log.middleware";
import { RedisModule } from "./redis/redis.module";
import { SharedService } from "./shared.service";
import { UploadModule } from "./upload/upload.module";

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
		TypeOrmModule.forRoot(connectionParams),
		LoggerModule,
		UploadModule,
		RedisModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					//每秒最多请求5次
					ttl: 1000,
					limit: 3,
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
	exports: [SharedService, Logger, LoggerModule, RedisModule],
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
