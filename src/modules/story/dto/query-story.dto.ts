/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 11:27:15
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:42
 * @FilePath: \cms\src\modules\story\dto\query-story.dto.ts
 * @Description:
 */
import { BaseQueryDto } from "@/shared/dtos";
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
