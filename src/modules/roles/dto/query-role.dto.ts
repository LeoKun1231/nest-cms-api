/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:15
 * @FilePath: \cms\src\modules\roles\dto\query-role.dto.ts
 * @Description:
 */
import { BaseQueryDto } from "@/shared/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class QueryRoleDto extends BaseQueryDto {
	@ApiProperty({ name: "角色名称", example: "管理员", type: String })
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty({ name: "角色描述", example: "管理员", type: String })
	@IsString()
	@IsOptional()
	intro: string;

	@ApiProperty({ name: "菜单列表", example: [1, 2, 3], type: [Number] })
	@IsArray({ message: "菜单列表必须是数组" })
	@IsOptional()
	menuList: number[];
}
