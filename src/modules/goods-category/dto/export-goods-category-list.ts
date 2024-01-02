/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 22:35:09
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:17
 * @FilePath: \cms\src\modules\goods-category\dto\export-goods-category-list.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExportGoodsCategoryDto } from "./export-goods-category.dto";

export class ExportGoodsCategoryListDto {
	@ApiProperty({
		description: "商品分类列表",
		type: ExportGoodsCategoryDto,
		isArray: true,
	})
	@Expose()
	@Type(() => ExportGoodsCategoryDto)
	list: ExportGoodsCategoryDto[];

	@ApiProperty({
		description: "商品分类总数",
		type: Number,
	})
	@Expose()
	totalCount: number;
}
