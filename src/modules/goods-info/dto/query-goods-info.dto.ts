/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 10:20:00
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:04
 * @FilePath: \cms\src\modules\goods-info\dto\query-goods-info.dto.ts
 * @Description:
 */
import { ValidateArrary, ValidateStringNumber } from "@/shared/decorators";
import { TransformNumber2Boolean } from "@/shared/decorators/transform-number-to-boolean";
import { BaseQueryDto } from "@/shared/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class QueryGoodsInfoDto extends BaseQueryDto {
	@ApiProperty({ name: "商品分类id", example: 1, type: Number })
	@ValidateStringNumber({ message: "商品分类id必须是字符串或者数字" })
	@Type(() => Number)
	@IsOptional()
	categoryId: number;

	@ApiProperty({
		name: "商品名称",
		example: "格姬2018秋装4",
		type: String,
	})
	@IsString({ message: "商品名称必须是字符串" })
	@IsOptional()
	name: string;

	@ApiProperty({ name: "原价", example: [1, 100], type: [Number, Number] })
	@ValidateArrary("原价")
	@IsOptional()
	oldPrice: number[];

	@ApiProperty({ name: "现价", example: [1, 100], type: [Number, Number] })
	@ValidateArrary("现价")
	@IsOptional()
	newPrice: number[];

	@ApiProperty({
		name: "商品描述",
		example: "格姬2018",
		type: String,
	})
	@IsString({ message: "商品描述必须是字符串" })
	@IsOptional()
	desc: string;

	@ApiProperty({ name: "商品状态", example: 1, type: Number })
	@TransformNumber2Boolean()
	@IsOptional()
	status: boolean;

	@ApiProperty({ name: "库存数量", example: [1, 100], type: [Number, Number] })
	@ValidateArrary("库存数量")
	@IsOptional()
	inventoryCount: number[];

	@ApiProperty({ name: "销售数量", example: [1, 100], type: [Number, Number] })
	@ValidateArrary("销售数量")
	@IsOptional()
	saleCount: number[];

	@ApiProperty({ name: "收藏数量", example: [1, 100], type: [Number, Number] })
	@ValidateArrary("收藏数量")
	@IsOptional()
	favorCount: number[];

	@ApiProperty({ name: "商品地址", example: "南京", type: String })
	@IsString({ message: "商品地址必须是字符串" })
	@IsOptional()
	address: string;
}
