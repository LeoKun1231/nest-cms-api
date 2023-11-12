import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGoodsCategoryDto {
	@ApiProperty({ description: "商品分类名" })
	@IsString({ message: "商品分类名必须是字符串" })
	@IsNotEmpty()
	name: string;
}
