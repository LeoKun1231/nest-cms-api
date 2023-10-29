/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-17 15:36:01
 * @FilePath: \cms\src\main.ts
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { setupLogger } from './log';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from './shared/enums/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: setupLogger(),
  });

  //swagger
  setupSwagger(app);

  app.setGlobalPrefix('/api/v1');
  //全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get(EnvEnum.APP_PORT));
}
bootstrap();
