/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-13 15:34:06
 * @FilePath: \cms\src\main.ts
 * @Description:
 */
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import * as path from "path";
import { AppModule } from "./app.module";
import { EnvEnum } from "./shared/enums";
import { setGlobalApp } from "./shared/global";
import { setupLogger } from "./shared/logger";
import { setupSwagger } from "./swagger";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: setupLogger(),
	});
	app.useStaticAssets(path.resolve(__dirname, "../files"), {
		prefix: "/api/v1/static/",
	});

	app.use(helmet());

	//swagger
	setupSwagger(app);

	app.setGlobalPrefix("/api/v1");
	//全局验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	const configService = app.get(ConfigService);
	await app.listen(configService.get(EnvEnum.APP_PORT));
	setGlobalApp(app);
}
bootstrap();
