/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 11:40:24
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 10:55:38
 * @FilePath: \cms\src\modules\story\dto\export-story.dto.ts
 * @Description:
 */
import { formatTime } from "@/shared/utils";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

export class ExportExportDto {
	@ApiProperty({
		description: "故事id",
		example: "故事id",
		type: Number,
	})
	@Expose()
	id: number;

	@ApiProperty({
		description: "故事名称",
		example: "故事名称",
		type: String,
	})
	@Expose()
	title: string;

	@ApiProperty({
		description: "故事内容",
		example: "故事内容",
		type: String,
	})
	@Expose()
	content: string;

	@ApiProperty({
		description: "是否启用",
		example: true,
		type: Boolean,
	})
	@Expose()
	@Type(() => Number)
	enable: number;

	@ApiProperty({
		description: "创建时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	updateAt: Date;
}
