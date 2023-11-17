/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:07
 * @FilePath: \cms\src\modules\goods-info\dto\update-goods-info.dto.ts
 * @Description:
 */
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { CreateGoodsInfoDto } from "./create-goods-info.dto";

export class UpdateGoodsInfoDto extends PartialType(CreateGoodsInfoDto) {
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
