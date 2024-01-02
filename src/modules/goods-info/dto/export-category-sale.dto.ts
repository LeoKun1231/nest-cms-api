/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 21:37:18
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:42:12
 * @FilePath: \cms\src\modules\goods\dtos\export-category-sale.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportCategorySaleDto {
	@ApiProperty({ description: "商品分类ID", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "商品分类名", example: "手机", type: String })
	@Expose()
	name: string;

	@ApiProperty({
		description: "商品分类对应商品销量",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	goodsCount: number;
}
