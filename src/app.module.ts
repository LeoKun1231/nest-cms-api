/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:50:47
 * @FilePath: \cms\src\app.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./modules/auth/auth.module";
import { DepartmentModule } from "./modules/department/department.module";
import { GoodsCategoryModule } from "./modules/goods-category/goods-category.module";
import { GoodsInfoModule } from "./modules/goods-info/goods-info.module";
import { MenusModule } from "./modules/menus/menus.module";
import { RolesModule } from "./modules/roles/roles.module";
import { StoryModule } from "./modules/story/story.module";
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
		GoodsInfoModule,
		GoodsCategoryModule,
		StoryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
