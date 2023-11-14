/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 22:29:18
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:21
 * @FilePath: \cms\src\modules\goods-category\dto\export-goods-category.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ExportGoodsCategoryDto {
	@ApiProperty({
		description: "分类id",
		example: "分类id",
		type: Number,
	})
	@Expose()
	id: number;

	@ApiProperty({
		description: "分类名称",
		example: "分类名称",
		type: String,
	})
	@Expose()
	name: string;

	@ApiProperty({
		description: "是否启用",
		example: true,
		type: Boolean,
	})
	@Expose()
	enable: boolean;

	@ApiProperty({
		description: "创建时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	updateAt: Date;
}
