import { ValidateDate } from "@/shared/decorators/validate-date.decorator";
import { ValidateStringNumber } from "@/shared/decorators/validate-string-number.decorator";
import { BasePaginationDto } from "@/shared/dtos/base-pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class QueryRoleDto extends BasePaginationDto {
	@ApiProperty({ name: "角色id", example: 1, type: Number })
	@ValidateStringNumber({ message: "角色id必须是字符串或者数字" })
	@IsOptional()
	@Type(() => Number)
	id: number;

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

	@ApiProperty({
		name: "创建时间",
		example: "2021-10-10 11:11:11",
		type: [Date, Date],
	})
	@IsOptional()
	@ValidateDate()
	createAt: Array<Date>;

	@ApiProperty({
		name: "更新时间",
		example: "2021-10-10 11:11:11",
		type: [Date, Date],
	})
	@ValidateDate()
	@IsOptional()
	updateAt: Array<Date>;
}
