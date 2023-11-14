import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportCategoryFavorDto {
	@ApiProperty({ description: "商品分类ID", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "商品分类名", example: "手机", type: String })
	@Expose()
	name: string;

	@ApiProperty({
		description: "商品分类对应商品收藏量",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	goodsFavor: number;
}
