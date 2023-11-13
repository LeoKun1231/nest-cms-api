import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

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
