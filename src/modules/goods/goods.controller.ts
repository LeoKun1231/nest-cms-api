/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 19:00:02
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:55:41
 * @FilePath: \cms\src\modules\goods\goods.controller.ts
 * @Description:
 */
import { Controller, Get } from "@nestjs/common";
import { GoodsService } from "./goods.service";

@Controller("goods")
export class GoodsController {
	constructor(private readonly goodsService: GoodsService) {}

	@Get("category/count")
	getCategoryCount() {
		return this.goodsService.getCategoryCount();
	}

	@Get("category/sale")
	getCategorySale() {
		return this.goodsService.getCategorySale();
	}
	@Get("category/favor")
	getCategoryFavor() {
		return this.goodsService.getCategoryFavor();
	}

	@Get("sale/top10")
	getSaleTop10() {
		return this.goodsService.getSaleTop10();
	}
	@Get("address/sale")
	getAddressSale() {
		return this.goodsService.getAddressSale();
	}

	@Get("amount/list")
	getAmountList() {
		return this.goodsService.getAmountList();
	}
}
