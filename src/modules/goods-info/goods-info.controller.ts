/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 12:09:11
 * @FilePath: \cms\src\modules\goods-info\goods-info.controller.ts
 * @Description:
 */
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
import { UpdateGoodsInfoDto } from "./dto/update-goods-info.dto";
import { GoodsInfoService } from "./goods-info.service";
import { QueryGoodsInfoDto } from "./dto/query-goods-info.dto";

@Controller("goods-info")
@ApiTags("商品信息模块")
export class GoodsInfoController {
	constructor(private readonly goodsInfoService: GoodsInfoService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createGoodsInfoDto: CreateGoodsInfoDto) {
		return this.goodsInfoService.create(createGoodsInfoDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryGoodsInfoDto: QueryGoodsInfoDto) {
		return this.goodsInfoService.findAll(queryGoodsInfoDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.goodsInfoService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateGoodsInfoDto: UpdateGoodsInfoDto,
	) {
		return this.goodsInfoService.update(+id, updateGoodsInfoDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.goodsInfoService.remove(+id);
	}
}
