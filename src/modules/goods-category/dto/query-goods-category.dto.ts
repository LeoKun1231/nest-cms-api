/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:54:36
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:25
 * @FilePath: \cms\src\modules\goods-category\dto\query-goods-category.dto.ts
 * @Description:
 */
import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryGoodsCategoryDto extends BaseQueryDto {
	@ApiProperty({ name: "分类名称", description: "分类名称", type: String })
	@IsString({ message: "分类名称必须是字符串" })
	@IsOptional()
	name: string;
}
