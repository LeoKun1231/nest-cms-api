import { ValidateDate } from "@/shared/decorators/validate-date.decorator";
import { ValidateStringNumber } from "@/shared/decorators/validate-string-number.decorator";
import { BasePaginationDto } from "@/shared/dtos/base-pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryDepartmentDto extends BasePaginationDto {
	@ApiProperty({ name: "部门id", example: 1, type: Number })
	@ValidateStringNumber({ message: "部门id必须是字符串或者数字" })
	@Type(() => Number)
	@IsOptional()
	id: number;

	@ApiProperty({ name: "部门名称", example: "技术部", type: String })
	@IsString({ message: "部门名称必须是字符串" })
	@IsOptional()
	name: string;

	@ApiProperty({ name: "父级id", example: 1, type: Number })
	@IsNumber({}, { message: "父级id必须是数字" })
	@Type(() => Number)
	@IsOptional()
	parentId: number;

	@ApiProperty({ name: "部门领导", example: "张三", type: String })
	@IsString({ message: "部门领导必须是字符串" })
	@IsOptional()
	leader: string;

	@ApiProperty({ name: "是否启用", example: true, type: Boolean })
	@IsOptional()
	enable: number;

	@ApiProperty({ name: "创建时间", example: "2021-10-10", type: [Date, Date] })
	@IsOptional()
	@ValidateDate()
	createAt: Array<Date>;

	@ApiProperty({ name: "更新时间", example: "2021-10-10", type: [Date, Date] })
	@ValidateDate()
	@IsOptional()
	updateAt: Array<Date>;
}
