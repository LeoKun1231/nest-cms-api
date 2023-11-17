/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:48
 * @FilePath: \cms\src\modules\department\dto\update-department.dto.ts
 * @Description:
 */
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { CreateDepartmentDto } from "./create-department.dto";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
	@ApiProperty({
		name: "是否启用 ",
		example: 0,
		type: Number,
		description: "0:禁用 1:启用",
	})
	@Type(() => Boolean)
	@IsOptional()
	enable: boolean;
}
