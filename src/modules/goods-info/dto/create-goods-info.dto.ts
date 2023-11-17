/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:53
 * @FilePath: \cms\src\modules\goods-info\dto\create-goods-info.dto.ts
 * @Description:
 */
import { ValidateStringNumber } from "@/shared/decorators/validate-string-number.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGoodsInfoDto {
	@ApiProperty({ description: "商品分类ID", example: 8, type: Number })
	@ValidateStringNumber({ message: "商品原价必须是数字或字符串" })
	@IsNotEmpty({ message: "商品原价不能为空" })
	@Type(() => Number)
	categoryId: number;

	@ApiProperty({ example: "iPhone 12", description: "商品名称", type: String })
	@IsString({ message: "商品名称必须是字符串" })
	@IsNotEmpty({ message: "商品名称不能为空" })
	name: string;

	@ApiProperty({ example: 9999, description: "商品原价", type: Number })
	@ValidateStringNumber({ message: "商品原价必须是数字或字符串" })
	@IsNotEmpty({ message: "商品原价不能为空" })
	@Type(() => Number)
	oldPrice: number;

	@ApiProperty({ example: 8888, description: "商品现价", type: Number })
	@ValidateStringNumber({ message: "商品现价必须是数字或字符串" })
	@IsNotEmpty({ message: "商品现价不能为空" })
	@Type(() => Number)
	newPrice: number;

	@ApiProperty({
		example: "The latest iPhone from Apple",
		description: "商品描述",
		type: String,
	})
	@IsString({ message: "商品描述必须是字符串" })
	@IsNotEmpty({ message: "商品描述不能为空" })
	desc: string;

	@ApiProperty({
		example: 1,
		description: "商品状态（1：在售，0：下架）",
		type: Number,
	})
	@ValidateStringNumber({ message: "商品状态必须是数字或字符串" })
	@IsNotEmpty({ message: "商品状态不能为空" })
	@Type(() => Number)
	status: number;

	@ApiProperty({
		example: "https://www.example.com/iphone12.png",
		description: "商品图片 URL",
		type: String,
	})
	@IsString({ message: "商品图片 URL 必须是字符串" })
	@IsNotEmpty({ message: "商品图片 URL 不能为空" })
	imgUrl: string;

	@ApiProperty({ example: 100, description: "商品库存数量", type: Number })
	@ValidateStringNumber({ message: "商品库存数量必须是数字或字符串" })
	@Type(() => Number)
	inventoryCount: number;

	@ApiProperty({ example: 1000, description: "商品销售数量", type: Number })
	@ValidateStringNumber({ message: "商品销售数量必须是数字或字符串" })
	@IsOptional()
	@Type(() => Number)
	saleCount: number;

	@ApiProperty({ example: 999, description: "商品收藏数量", type: Number })
	@ValidateStringNumber({ message: "商品收藏数量必须是数字或字符串" })
	@Type(() => Number)
	@IsOptional()
	favorCount: number;

	@ApiProperty({ example: "北京", description: "商品所在地址", type: String })
	@IsString({ message: "商品所在地址必须是字符串" })
	@IsNotEmpty({ message: "商品所在地址不能为空" })
	address: string;
}
