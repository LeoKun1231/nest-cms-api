/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:36
 * @FilePath: \cms\src\modules\menus\dto\create-menu.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateMenuDto {
	@ApiProperty({
		description: "菜单名",
		maxLength: 20,
		example: "菜单名",
		type: String,
	})
	@IsString({ message: "菜单名必须是字符串" })
	@IsNotEmpty({ message: "菜单名不能为空" })
	@MaxLength(20, { message: "菜单名不能超过20个字符" })
	name: string;

	@ApiProperty({ description: "菜单层级", example: 0, type: Number })
	@IsInt({ message: "菜单层级必须是数字" })
	@IsNotEmpty({ message: "菜单层级不能为空" })
	@Type(() => Number)
	type: number;

	@ApiProperty({ description: "菜单url", example: "/menu", type: String })
	@IsString({ message: "菜单url必须是字符串" })
	@IsOptional()
	url: string;

	@ApiProperty({ description: "菜单排序", example: 0, type: Number })
	@IsInt({ message: "菜单排序必须是数字" })
	@IsOptional()
	@Type(() => Number)
	sort: number;

	@ApiProperty({
		description: "菜单图标",
		example: "el-icon-s-home",
		type: String,
	})
	@IsString({ message: "菜单图标必须是字符串" })
	@IsOptional()
	icon: string;

	@ApiProperty({ description: "菜单父级id", example: 0, type: Number })
	@IsInt({ message: "菜单父级id必须是数字" })
	@IsOptional()
	@Type(() => Number)
	parentId: number;

	@ApiProperty({ description: "菜单权限", example: "admin", type: String })
	@IsString({ message: "菜单权限必须是字符串" })
	@IsOptional()
	permission: string;
}
