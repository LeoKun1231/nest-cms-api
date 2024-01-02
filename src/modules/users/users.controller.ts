/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 12:00:06
 * @FilePath: \cms\src\modules\users\users.controller.ts
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
import { CreateUserDto } from "./dtos/create-user.dto";
import { QueryUserDto } from "./dtos/query-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("用户管理模块")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * 用户注册
	 * @param registerAccountDto 注册信息
	 * @returns
	 */
	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_USERS_CREATE)
	register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}

	/**
	 * 查询用户
	 * @param id 用户id
	 * @returns
	 */
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.usersService.findUserById(+id);
	}

	/**
	 * 查询用户列表
	 * @param queryUserDto 查询条件
	 * @returns
	 */
	@Post("list")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_USERS_QUERY)
	findAll(@Body() queryUserDto: QueryUserDto) {
		return this.usersService.findAll(queryUserDto);
	}

	/**
	 * 更新用户
	 * @param id 用户id
	 * @param updateUserDto 更新信息
	 * @returns
	 */
	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_USERS_UPDATE)
	update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(+id, updateUserDto);
	}

	/**
	 * 删除用户
	 * @param id 用户id
	 * @returns
	 */
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_USERS_DELETE)
	remove(@Param("id") id: string) {
		return this.usersService.remove(+id);
	}
}
