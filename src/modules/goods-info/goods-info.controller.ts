/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:46:46
 * @FilePath: \cms\src\modules\goods-info\goods-info.controller.ts
 * @Description:
 */
import { RequirePermission } from "@/shared/decorators";
import { PermissionEnum } from "@/shared/enums";
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
import { CreateGoodsInfoDto } from "./dto/create-goods-info.dto";
import { QueryGoodsInfoDto } from "./dto/query-goods-info.dto";
import { UpdateGoodsInfoDto } from "./dto/update-goods-info.dto";
import { GoodsInfoService } from "./goods-info.service";

@Controller("goods")
@ApiTags("商品信息模块")
export class GoodsInfoController {
	constructor(private readonly goodsInfoService: GoodsInfoService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_GOODS_CREATE)
	create(@Body() createGoodsInfoDto: CreateGoodsInfoDto) {
		return this.goodsInfoService.create(createGoodsInfoDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_GOODS_QUERY)
	findAll(@Body() queryGoodsInfoDto: QueryGoodsInfoDto) {
		return this.goodsInfoService.findAll(queryGoodsInfoDto);
	}

	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_GOODS_QUERY)
	findOne(@Param("id") id: string) {
		return this.goodsInfoService.findOne(+id);
	}

	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_GOODS_UPDATE)
	update(
		@Param("id") id: string,
		@Body() updateGoodsInfoDto: UpdateGoodsInfoDto,
	) {
		return this.goodsInfoService.update(+id, updateGoodsInfoDto);
	}

	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_GOODS_DELETE)
	remove(@Param("id") id: string) {
		return this.goodsInfoService.remove(+id);
	}

	@Get("category/count")
	getCategoryCount() {
		return this.goodsInfoService.getCategoryCount();
	}

	@Get("category/sale")
	getCategorySale() {
		return this.goodsInfoService.getCategorySale();
	}
	@Get("category/favor")
	getCategoryFavor() {
		return this.goodsInfoService.getCategoryFavor();
	}

	@Get("sale/top10")
	getSaleTop10() {
		return this.goodsInfoService.getSaleTop10();
	}
	@Get("address/sale")
	getAddressSale() {
		return this.goodsInfoService.getAddressSale();
	}

	@Get("amount/list")
	getAmountList() {
		return this.goodsInfoService.getAmountCounts();
	}
}
