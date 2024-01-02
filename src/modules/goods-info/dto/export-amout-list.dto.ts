/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 21:38:37
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:47:48
 * @FilePath: \cms\src\modules\goods\dtos\export-amout-list.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportAmoutListDto {
	@ApiProperty({ description: "统计信息名", example: "sale", type: String })
	@Expose()
	amount: string;

	@ApiProperty({
		description: "统计信息标题",
		example: "商品总销量",
		type: String,
	})
	@Expose()
	title: string;

	@ApiProperty({
		description: "统计信息提示",
		example: "所有商品的总销量",
		type: String,
	})
	@Expose()
	tips: string;

	@ApiProperty({
		description: "统计信息子标题",
		example: "商品总销量",
		type: String,
	})
	@Expose()
	subtitle: string;

	@ApiProperty({
		description: "统计数据1",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	number1: number;

	@ApiProperty({
		description: "统计数据2",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	number2: number;
}
