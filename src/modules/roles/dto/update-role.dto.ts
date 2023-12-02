/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:19
 * @FilePath: \cms\src\modules\roles\dto\update-role.dto.ts
 * @Description:
 */
import { TransformNumber2Boolean } from "@/shared/decorators/transform-number-to-boolean";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
	@ApiProperty({
		name: "是否启用 ",
		example: 0,
		type: Number,
		description: "0:禁用 1:启用",
	})
	@TransformNumber2Boolean()
	@IsOptional()
	enable: boolean;
}
