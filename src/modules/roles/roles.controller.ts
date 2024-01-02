/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:53:30
 * @FilePath: \cms\src\modules\roles\roles.controller.ts
 * @Description:
 */
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
import { AssignRoleDto } from "./dto/assign-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { QueryRoleDto } from "./dto/query-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";
import { RequirePermission } from "@/shared/decorators";
import { PermissionEnum } from "@/shared/enums";

@Controller("role")
@ApiTags("角色管理模块")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	/**
	 * 创建角色
	 * @param createRoleDto 创建信息
	 * @returns
	 */
	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_CREATE)
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	/**
	 * 查询角色列表
	 * @param queryRoleDto 查询条件
	 * @returns
	 */
	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryRoleDto: QueryRoleDto) {
		return this.rolesService.findAll(queryRoleDto);
	}

	/**
	 * 查询角色
	 * @param id 角色id
	 * @returns
	 */
	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_QUERY)
	findOne(@Param("id") id: string) {
		return this.rolesService.findOne(+id);
	}

	/**
	 * 更新角色
	 * @param id 角色id
	 * @param updateRoleDto 更新信息
	 * @returns
	 */
	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_UPDATE)
	update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	/**
	 * 删除角色
	 * @param id 角色id
	 * @returns
	 */
	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_DELETE)
	remove(@Param("id") id: string) {
		return this.rolesService.remove(+id);
	}

	@Get(":id/menu")
	findRoleMenu(@Param("id") id: string) {
		return this.rolesService.findRoleMenuById(+id);
	}

	@Get(":id/menuIds")
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_QUERY)
	findRoleMenuIds(@Param("id") id: string) {
		return this.rolesService.findRoleMenuIdsById(+id);
	}

	@Post("assign")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_ROLE_UPDATE)
	assignRole(@Body() assignRoleDto: AssignRoleDto) {
		return this.rolesService.assignRole(assignRoleDto);
	}
}
