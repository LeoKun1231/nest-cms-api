/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 11:03:45
 * @FilePath: \cms\src\modules\menus\dto\export-menu.dto.ts
 * @Description:
 */
import { ExposeNotNull } from "@/shared/decorators";
import { formatTime } from "@/shared/utils";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

@Expose()
export class ExportMenuDto {
	@ApiProperty({ description: "菜单 ID", example: "1", type: String })
	@Expose()
	id: string;

	@ApiProperty({ description: "菜单名称", example: "用户管理", type: String })
	@Expose()
	name: string;

	@ApiProperty({ description: "菜单层级", example: 1, type: Number })
	@Expose()
	type: number;

	@ApiProperty({ description: "菜单地址", example: "/user", type: String })
	@Expose()
	url: string;

	@ApiProperty({ description: "菜单图标", example: "user", type: String })
	@ExposeNotNull()
	icon: string;

	@ApiProperty({ description: "菜单排序", example: 1, type: Number })
	@Expose()
	sort: number;

	@ApiProperty({
		description: "是否启用",
		example: true,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	enable: number;

	@ApiProperty({ description: "菜单父级id", example: "1", type: String })
	@Expose()
	parentId: string;

	@ApiProperty({ description: "菜单权限", example: "admin", type: String })
	@ExposeNotNull()
	permission: string;

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

	@ApiProperty({ description: "子菜单", example: [], type: [ExportMenuDto] })
	@Type(() => ExportMenuDto)
	@ExposeNotNull()
	children: ExportMenuDto[];
}
