/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 10:27:12
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:53:05
 * @FilePath: \cms\src\shared\middleware\log.middleware.ts
 * @Description:
 */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { AppLoggerSevice } from "../logger/logger.service";
import { getReqMainInfo } from "../utils";
@Injectable()
export class LogMiddleware implements NestMiddleware {
	constructor(private readonly logger: AppLoggerSevice) {}
	use(req: Request, res: Response, next: () => void) {
		// 记录日志
		this.logger.log(getReqMainInfo(req), req.url);
		next();
	}
}
