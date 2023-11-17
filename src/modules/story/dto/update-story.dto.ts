/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:45
 * @FilePath: \cms\src\modules\story\dto\update-story.dto.ts
 * @Description:
 */
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { CreateStoryDto } from "./create-story.dto";

export class UpdateStoryDto extends PartialType(CreateStoryDto) {
	@ApiProperty({
		name: "是否启用 ",
		example: 0,
		type: Number,
		description: "0:禁用 1:启用",
	})
	@Type(() => Boolean)
	@IsOptional()
	enable: boolean;
}
