/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:53
 * @FilePath: \cms\src\modules\menus\menus.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";
import { MenusController } from "./menus.controller";
import { MenusService } from "./menus.service";

@Module({
	imports: [],
	controllers: [MenusController],
	providers: [MenusService],
	exports: [MenusService],
})
export class MenusModule {}
