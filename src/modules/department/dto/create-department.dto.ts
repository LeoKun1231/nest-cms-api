/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:26
 * @FilePath: \cms\src\modules\department\dto\create-department.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
	@ApiProperty({ description: "部门名称", example: "研发部", type: String })
	@IsString({ message: "部门名称必须为字符类型" })
	@IsNotEmpty({ message: "部门名称不能为空" })
	name: string;

	@ApiProperty({ description: "父级id", example: 1, type: Number })
	@IsInt({ message: "父级id必须为数字类型" })
	@IsOptional()
	parentId: number;

	@ApiProperty({ description: "部门领导", example: "张三", type: String })
	@IsString({ message: "部门领导必须为字符类型" })
	@IsOptional()
	leader: string;
}
