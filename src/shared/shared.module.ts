import {
	Global,
	Logger,
	MiddlewareConsumer,
	Module,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { connectionParams } from "../ormconfig";
import loadEnvConfig from "./config/loadEnv.config";
import { validationSchema } from "./config/validateEnv.config";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { PermissionAuthGuard } from "./guards/permission-auth.guard";
import { TransformResultInterceptor } from "./interceptors/transform.interceptor";
import { LoggerModule } from "./logger/logger.module";
import { LogMiddleware } from "./middleware/log.middleware";

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
	],
	providers: [
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
		//全部权限守卫
		{
			provide: APP_GUARD,
			useClass: PermissionAuthGuard,
		},
	],
	exports: [Logger, LoggerModule],
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
