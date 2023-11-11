/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 12:00:06
 * @FilePath: \cms\src\modules\users\users.controller.ts
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
import { CreateUserDto } from "./dtos/create-user.dto";
import { QueryUserDto } from "./dtos/query-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * 用户注册
	 * @param registerAccountDto 注册信息
	 * @returns
	 */
	@Post()
	@HttpCode(HttpStatus.OK)
	register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.usersService.findUserById(+id);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryUserDto: QueryUserDto) {
		return this.usersService.findAll(queryUserDto);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(+id, updateUserDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	remove(@Param("id") id: string) {
		return this.usersService.remove(+id);
	}
}
