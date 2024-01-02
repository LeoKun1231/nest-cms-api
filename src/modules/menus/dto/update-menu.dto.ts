/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:49
 * @FilePath: \cms\src\modules\menus\dto\update-menu.dto.ts
 * @Description:
 */
import { TransformNumber2Boolean } from "@/shared/decorators/transform-number-to-boolean";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateMenuDto } from "./create-menu.dto";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
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
