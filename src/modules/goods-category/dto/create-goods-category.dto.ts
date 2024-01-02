/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 12:04:11
 * @FilePath: \cms\src\modules\goods-category\dto\create-goods-category.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGoodsCategoryDto {
	@ApiProperty({ description: "商品分类名" })
	@IsString({ message: "商品分类名必须是字符串" })
	@IsNotEmpty({ message: "商品分类名不能为空" })
	name: string;
}
