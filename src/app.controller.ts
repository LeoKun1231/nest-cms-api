/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-17 10:14:47
 * @FilePath: \cms\src\app.controller.ts
 * @Description:
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Body, Post } from '@nestjs/common/decorators';
import { Users } from '@/shared/entities/Users.entity';
import { AppLoggerSevice } from './shared/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: AppLoggerSevice,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get('aa')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('bb')
  getHello2(@Body() user: Users) {
    return user;
  }
}
