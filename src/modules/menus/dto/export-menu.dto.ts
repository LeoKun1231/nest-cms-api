import { ExposeNotNull } from "@/shared/decorators/expose-not-null.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

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
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	updateAt: Date;

	@ApiProperty({ description: "子菜单", example: [], type: [ExportMenuDto] })
	@Type(() => ExportMenuDto)
	@ExposeNotNull()
	children: ExportMenuDto[];
}
