import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryStoryDto extends BaseQueryDto {
	@ApiProperty({
		description: "故事标题",
		example: "故事标题",
		type: String,
	})
	@IsString()
	@IsOptional()
	title: string;
}
