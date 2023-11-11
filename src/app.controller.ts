/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-17 10:14:47
 * @FilePath: \cms\src\app.controller.ts
 * @Description:
 */
import { User } from "@/shared/entities/user.entity";
import { Controller, Get } from "@nestjs/common";
import { Body, Post } from "@nestjs/common/decorators";
import { AppService } from "./app.service";
import { RequirePermission } from "./shared/decorators/require-permission.decorator";
import { PermissionEnum } from "./shared/enums/permission.enum";
import { AppLoggerSevice } from "./shared/logger/logger.service";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly logger: AppLoggerSevice,
	) {
		this.logger.setContext(AppController.name);
	}

	@Get("aa")
	@RequirePermission([PermissionEnum.SYSTEM_ROLE_CREATE], "and")
	getHello(): string {
		return this.appService.getHello();
	}

	@Post("bb")
	getHello2(@Body() user: User) {
		return user;
	}
}
