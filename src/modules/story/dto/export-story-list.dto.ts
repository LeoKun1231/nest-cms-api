/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 11:45:48
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:36
 * @FilePath: \cms\src\modules\story\dto\export-story-list.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExportExportDto } from "./export-story.dto";

export class ExportStoryListDto {
	@ApiProperty({
		description: "故事列表",
		example: "故事列表",
		type: [ExportExportDto],
	})
	@Expose()
	@Type(() => ExportExportDto)
	list: ExportExportDto[];

	@ApiProperty({
		description: "故事总数",
		example: 1,
		type: Number,
	})
	@Expose()
	totalCount: number;
}
