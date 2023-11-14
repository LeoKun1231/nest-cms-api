import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateGoodsCategoryDto } from "./dto/create-goods-category.dto";
import { QueryGoodsCategoryDto } from "./dto/query-goods-category.dto";
import { UpdateGoodsCategoryDto } from "./dto/update-goods-category.dto";
import { GoodsCategoryService } from "./goods-category.service";

@Controller("category")
@ApiTags("商品分类模块")
export class GoodsCategoryController {
	constructor(private readonly goodsCategoryService: GoodsCategoryService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createGoodsCategoryDto: CreateGoodsCategoryDto) {
		return this.goodsCategoryService.create(createGoodsCategoryDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryGoodsCategoryDto: QueryGoodsCategoryDto) {
		return this.goodsCategoryService.findAll(queryGoodsCategoryDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.goodsCategoryService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateGoodsCategoryDto: UpdateGoodsCategoryDto,
	) {
		return this.goodsCategoryService.update(+id, updateGoodsCategoryDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.goodsCategoryService.remove(+id);
	}
}
