import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
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
