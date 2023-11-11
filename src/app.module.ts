/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 09:34:05
 * @FilePath: \cms\src\app.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./modules/auth/auth.module";
import { DepartmentModule } from "./modules/department/department.module";
import { MenusModule } from "./modules/menus/menus.module";
import { RolesModule } from "./modules/roles/roles.module";
import { UsersModule } from "./modules/users/users.module";
import { SharedModule } from "./shared/shared.module";

@Module({
	imports: [
		SharedModule,
		AuthModule,
		UsersModule,
		RolesModule,
		MenusModule,
		DepartmentModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
