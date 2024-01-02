/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 09:40:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:53:00
 * @FilePath: \cms\src\shared\logger\logger.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";
import { AppLoggerSevice } from "./logger.service";

@Module({
	controllers: [],
	providers: [AppLoggerSevice],
	exports: [AppLoggerSevice],
})
export class LoggerModule {}
