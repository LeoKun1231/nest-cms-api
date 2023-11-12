import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryGoodsCategoryDto extends BaseQueryDto {
	@ApiProperty({ name: "分类名称", description: "分类名称", type: String })
	@IsString({ message: "分类名称必须是字符串" })
	@IsOptional()
	name: string;
}