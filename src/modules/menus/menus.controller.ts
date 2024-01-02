/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:32:57
 * @FilePath: \cms\src\modules\menus\menus.controller.ts
 * @Description:
 */
import { RequirePermission } from "@/shared/decorators";
import { PermissionEnum } from "@/shared/enums";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { MenusService } from "./menus.service";

@Controller("menu")
@ApiTags("菜单管理模块")
export class MenusController {
	constructor(private readonly menusService: MenusService) {}

	/**
	 * 创建菜单
	 * @param createMenuDto 创建信息
	 * @returns
	 */
	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_MENU_CREATE)
	create(@Body() createMenuDto: CreateMenuDto) {
		return this.menusService.create(createMenuDto);
	}

	/**
	 * 查询菜单列表
	 * @returns
	 */
	@Post("list")
	@HttpCode(HttpStatus.OK)
	async findAll() {
		return {
			list: await this.menusService.findAll(),
		};
	}

	/**
	 * 查询菜单
	 * @param id 菜单id
	 * @returns
	 */
	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_MENU_QUERY)
	findOne(@Param("id") id: string) {
		return this.menusService.findOne(+id);
	}

	/**
	 * 更新菜单
	 * @param id 菜单id
	 * @param updateMenuDto 更新信息
	 * @returns
	 */
	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_MENU_UPDATE)
	update(@Param("id") id: string, @Body() updateMenuDto: UpdateMenuDto) {
		return this.menusService.update(+id, updateMenuDto);
	}

	/**
	 * 删除菜单
	 * @param id 菜单id
	 * @returns
	 */
	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_MENU_DELETE)
	remove(@Param("id") id: string) {
		return this.menusService.remove(+id);
	}
}
