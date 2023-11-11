import { ExportMenuDto } from "@/modules/menus/dto/export-menu.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportRoleDto {
	@ApiProperty({ description: "角色 ID", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "角色名称", example: "管理员", type: String })
	@Expose()
	name: string;

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
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	updateAt: Date;

	@Expose()
	@Type(() => ExportMenuDto)
	menuList: ExportMenuDto[];
}
