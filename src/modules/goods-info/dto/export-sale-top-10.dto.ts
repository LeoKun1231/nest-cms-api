/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 21:38:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:41:32
 * @FilePath: \cms\src\modules\goods\dtos\export-sale-top-10.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportSaleTop10Dto {
	@ApiProperty({ description: "商品分类ID", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "商品分类名", example: "手机", type: String })
	@Expose()
	name: string;

	@ApiProperty({
		description: "商品分类对应商品销售数量",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	saleCount: number;
}
