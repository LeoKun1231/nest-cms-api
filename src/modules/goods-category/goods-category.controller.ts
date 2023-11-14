/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:52:30
 * @FilePath: \cms\src\modules\goods-category\goods-category.controller.ts
 * @Description:
 */
import { RequirePermission } from "@/shared/decorators/require-permission.decorator";
import { PermissionEnum } from "@/shared/enums/permission.enum";
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
	@RequirePermission(PermissionEnum.SYSTEM_CATEGORY_CREATE)
	create(@Body() createGoodsCategoryDto: CreateGoodsCategoryDto) {
		return this.goodsCategoryService.create(createGoodsCategoryDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_CATEGORY_QUERY)
	findAll(@Body() queryGoodsCategoryDto: QueryGoodsCategoryDto) {
		return this.goodsCategoryService.findAll(queryGoodsCategoryDto);
	}

	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_CATEGORY_QUERY)
	findOne(@Param("id") id: string) {
		return this.goodsCategoryService.findOne(+id);
	}

	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_CATEGORY_UPDATE)
	update(
		@Param("id") id: string,
		@Body() updateGoodsCategoryDto: UpdateGoodsCategoryDto,
	) {
		return this.goodsCategoryService.update(+id, updateGoodsCategoryDto);
	}

	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_CATEGORY_DELETE)
	remove(@Param("id") id: string) {
		return this.goodsCategoryService.remove(+id);
	}
}
