/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 11:04:04
 * @FilePath: \cms\src\modules\roles\dto\export-role.dto.ts
 * @Description:
 */
import { ExportMenuDto } from "@/modules/menus/dto/export-menu.dto";
import { formatTime } from "@/shared/utils";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

export class ExportRoleDto {
	@ApiProperty({ description: "角色 ID", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "角色名称", example: "管理员", type: String })
	@Expose()
	name: string;

	@ApiProperty({
		description: "是否启用",
		example: true,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	enable: number;

	@ApiProperty({
		description: "角色简介",
		example: "拥有所有权限",
		type: String,
	})
	@Expose()
	intro: string;

	@ApiProperty({
		description: "创建时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	updateAt: Date;

	@Expose()
	@Type(() => ExportMenuDto)
	menuList: ExportMenuDto[];
}
