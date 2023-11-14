/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:28
 * @FilePath: \cms\src\modules\goods-category\dto\update-goods-category.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateGoodsCategoryDto } from "./create-goods-category.dto";

export class UpdateGoodsCategoryDto extends PartialType(
	CreateGoodsCategoryDto,
) {}
