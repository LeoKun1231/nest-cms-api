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
