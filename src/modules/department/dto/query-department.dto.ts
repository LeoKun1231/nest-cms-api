/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:41
 * @FilePath: \cms\src\modules\department\dto\query-department.dto.ts
 * @Description:
 */
import { BaseQueryDto } from "@/shared/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryDepartmentDto extends BaseQueryDto {
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
}
