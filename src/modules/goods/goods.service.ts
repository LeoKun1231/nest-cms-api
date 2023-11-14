/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 19:00:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:46:38
 * @FilePath: \cms\src\modules\goods\goods.service.ts
 * @Description:
 */

import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { GoodsInfoService } from "../goods-info/goods-info.service";
import { ExportAddressSaleDto } from "./dtos/export-address-sale.dto";
import { ExportAmoutListDto } from "./dtos/export-amout-list.dto";
import { ExportCategoryCountDto } from "./dtos/export-category-count.dto";
import { ExportCategoryFavorDto } from "./dtos/export-category-favor.dto";
import { ExportCategorySaleDto } from "./dtos/export-category-sale.dto";
import { ExportSaleTop10Dto } from "./dtos/export-sale-top-10.dto";

@Injectable()
export class GoodsService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly goodsInfoService: GoodsInfoService,
	) {
		this.logger.setContext(GoodsService.name);
	}

	/**
	 * @description: 获取分类数量
	 * @param {*}
	 * @return {*}
	 */
	async getCategoryCount() {
		this.logger.log(`${this.getCategoryCount.name} was called`);
		const categoryCountList = await this.goodsInfoService.getCategoryCount();
		return plainToInstance(ExportCategoryCountDto, categoryCountList, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * @description: 获取分类销售
	 * @param {*}
	 * @return {*}
	 */
	async getCategorySale() {
		this.logger.log(`${this.getCategorySale.name} was called`);
		const categorySaleList = await this.goodsInfoService.getCategorySale();
		return plainToInstance(ExportCategorySaleDto, categorySaleList, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * @description: 获取分类收藏
	 * @param {*}
	 * @return {*}
	 */
	async getCategoryFavor() {
		this.logger.log(`${this.getCategoryFavor.name} was called`);
		const categoryFavorList = await this.goodsInfoService.getCategoryFavor();
		return plainToInstance(ExportCategoryFavorDto, categoryFavorList, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * @description: 获取销售top10
	 * @param {*}
	 * @return {*}
	 */
	async getSaleTop10() {
		this.logger.log(`${this.getSaleTop10.name} was called`);
		const saleTop10List = await this.goodsInfoService.getSaleTop10();
		return plainToInstance(ExportSaleTop10Dto, saleTop10List, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * @description: 获取地区销售信息
	 * @param {*}
	 * @return {*}
	 */
	async getAddressSale() {
		this.logger.log(`${this.getAddressSale.name} was called`);
		const addressSaleList = await this.goodsInfoService.getAddressSale();
		return plainToInstance(ExportAddressSaleDto, addressSaleList, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * @description: 获取统计信息
	 * @param {*}
	 * @return {*}
	 */
	async getAmountList() {
		this.logger.log(`${this.getAmountList.name} was called`);
		const { favor, inventory, sale, saleroom } =
			await this.goodsInfoService.getAmountCounts();
		const amountList = [
			{
				amount: "sale",
				title: "商品总销量",
				tips: "所有商品的总销量",
				subtitle: "商品总销量",
				number1: sale,
				number2: sale,
			},
			{
				amount: "favor",
				title: "商品总收藏",
				tips: "所有商品的总收藏",
				subtitle: "商品总收藏",
				number1: favor,
				number2: favor,
			},
			{
				amount: "inventory",
				title: "商品总库存",
				tips: "所有商品的总库存",
				subtitle: "商品总库存",
				number1: inventory,
				number2: inventory,
			},
			{
				amount: "saleroom",
				title: "商品总销售额",
				tips: "所有商品的总销售额",
				subtitle: "商品总销售额",
				number1: saleroom,
				number2: saleroom,
			},
		];
		return plainToInstance(ExportAmoutListDto, amountList, {
			excludeExtraneousValues: true,
		});
	}
}
