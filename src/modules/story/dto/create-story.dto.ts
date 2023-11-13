import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStoryDto {
	@ApiProperty({
		description: "故事标题",
		example: "故事标题",
		type: String,
	})
	@IsString({ message: "标题必须是字符串" })
	@IsNotEmpty({ message: "标题不能为空" })
	title: string;

	@ApiProperty({
		description: "故事内容",
		example: "故事内容",
		type: String,
	})
	@IsString({ message: "内容必须是字符串" })
	@IsNotEmpty({ message: "内容不能为空" })
	content: string;
}
