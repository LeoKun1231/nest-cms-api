/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 13:21:20
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:56
 * @FilePath: \cms\src\modules\goods-info\dto\export-goods-info-list.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExportGoodsInfoDto } from "./export-goods-info.dto";

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
