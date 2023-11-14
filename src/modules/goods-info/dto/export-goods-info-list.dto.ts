import { ApiProperty } from "@nestjs/swagger";
import { ExportGoodsInfoDto } from "./export-goods-info.dto";
import { Expose, Type } from "class-transformer";

export class ExportGoodsInfoList {
	@ApiProperty({
		name: "商品列表",
		type: ExportGoodsInfoDto,
		description: "商品列表",
	})
	@Type(() => ExportGoodsInfoDto)
	@Expose()
	list: ExportGoodsInfoDto[];

	@ApiProperty({
		name: "商品总数",
		type: Number,
		description: "商品总数",
	})
	@Expose()
	totalCount: number;
}
