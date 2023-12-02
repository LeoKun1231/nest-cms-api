/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 19:12:21
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:35:16
 * @FilePath: \cms\src\modules\users\dtos\update-user.dto.ts
 * @Description:
 */
import { TransformNumber2Boolean } from "@/shared/decorators/transform-number-to-boolean";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
