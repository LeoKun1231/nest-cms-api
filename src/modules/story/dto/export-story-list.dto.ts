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
