/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:28
 * @FilePath: \cms\src\modules\goods-category\dto\update-goods-category.dto.ts
 * @Description:
 */
import { TransformNumber2Boolean } from "@/shared/decorators/transform-number-to-boolean";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateGoodsCategoryDto } from "./create-goods-category.dto";

export class UpdateGoodsCategoryDto extends PartialType(
	CreateGoodsCategoryDto,
) {
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
