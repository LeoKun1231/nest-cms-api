import { ValidateNumberArrary } from "@/shared/decorators/validate-number-array.decorator";
import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryGoodsInfoDto extends BaseQueryDto {
	@ApiProperty({
		name: "商品名称",
		example: "格姬2018秋装4",
		type: String,
	})
	@IsString({ message: "商品名称必须是字符串" })
	@IsOptional()
	name: string;

	@ApiProperty({ name: "原价", example: [1, 100], type: [Number, Number] })
	@ValidateNumberArrary("原价")
	@IsOptional()
	oldPrice: number[];

	@ApiProperty({ name: "现价", example: [1, 100], type: [Number, Number] })
	@ValidateNumberArrary("现价")
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
	@IsNumber({}, { message: "商品状态必须是数字" })
	@Type(() => Number)
	@IsOptional()
	status: number;

	@ApiProperty({ name: "库存数量", example: [1, 100], type: [Number, Number] })
	@ValidateNumberArrary("库存数量")
	@IsOptional()
	inventoryCount: number[];

	@ApiProperty({ name: "销售数量", example: [1, 100], type: [Number, Number] })
	@ValidateNumberArrary("销售数量")
	@IsOptional()
	saleCount: number[];

	@ApiProperty({ name: "收藏数量", example: [1, 100], type: [Number, Number] })
	@ValidateNumberArrary("收藏数量")
	@IsOptional()
	favorCount: number[];

	@ApiProperty({ name: "商品地址", example: "南京", type: String })
	@IsString({ message: "商品地址必须是字符串" })
	@IsOptional()
	address: string;
}
