/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-22 11:00:15
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:50:36
 * @FilePath: \cms\src\shared\decorators\get-current-user.decorator.ts
 * @Description:
 */
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const GetCurrentUser = createParamDecorator(
	(param: any, context: ExecutionContext) => {
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request>();
		return req.user[param];
	},
);
