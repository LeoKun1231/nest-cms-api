/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 21:38:27
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:43:11
 * @FilePath: \cms\src\modules\goods\dtos\export-address-sale.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ExportAddressSaleDto {
	@ApiProperty({ description: "城市", example: "北京", type: String })
	@Expose()
	address: string;

	@ApiProperty({
		description: "城市所对应商品销售数量",
		example: 1,
		type: Number,
	})
	@Type(() => Number)
	@Expose()
	count: number;
}
