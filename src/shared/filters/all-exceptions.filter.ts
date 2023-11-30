/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 18:56:47
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:52:10
 * @FilePath: \cms\src\shared\filters\all-exceptions.filter.ts
 * @Description:
 */
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as requestIp from "request-ip";
import { AppLoggerSevice } from "../logger";
import { formatTime } from "../utils";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: AppLoggerSevice) {}
	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const message =
			exception instanceof HttpException
				? (exception.getResponse() as any).message instanceof Array
					? (exception.getResponse() as any).message.join(",")
					: (exception.getResponse() as any).message
				: "服务器错误，请稍后重试。";

		const responseBody = {
			code: httpStatus,
			message,
			path: request.url,
			timestamp: formatTime(new Date()),
		};

		if (responseBody.message == "TokenExpiredError: jwt expired") {
			responseBody.message = "登录已过期，请重新登录";
		} else if (responseBody.message == "Error: No auth token") {
			responseBody.message = "请先登录";
		} else if (httpStatus == 429) {
			responseBody.message = "请求过于频繁，请稍后再试";
		}

		this.logger.error(
			{
				...responseBody,
				ip: requestIp.getClientIp(request),
			},
			null,
			"AllExceptions",
		);

		response.status(httpStatus).json(responseBody);
	}
}
