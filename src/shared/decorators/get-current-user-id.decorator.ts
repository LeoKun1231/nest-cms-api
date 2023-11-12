/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-22 10:59:55
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 11:39:58
 * @FilePath: \cms\src\shared\decorators\get-current-user-id.decorator.ts
 * @Description:
 */
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const GetCurrentUserID = createParamDecorator(
	(_: undefined, context: ExecutionContext) => {
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request>();
		return req.user?.["id"];
	},
);
