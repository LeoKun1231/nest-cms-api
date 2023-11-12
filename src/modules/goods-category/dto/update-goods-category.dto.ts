import { PartialType } from "@nestjs/swagger";
import { CreateGoodsCategoryDto } from "./create-goods-category.dto";

export class UpdateGoodsCategoryDto extends PartialType(
	CreateGoodsCategoryDto,
) {}
