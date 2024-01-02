/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:50:10
 * @FilePath: \cms\src\modules\goods-info\goods-info.service.ts
 * @Description:
 */
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { GoodsCategoryService } from "../goods-category/goods-category.service";
import { CreateGoodsInfoDto } from "./dto/create-goods-info.dto";
import { ExportAddressSaleDto } from "./dto/export-address-sale.dto";
import { ExportAmoutListDto } from "./dto/export-amout-list.dto";
import { ExportCategoryCountDto } from "./dto/export-category-count.dto";
import { ExportCategoryFavorDto } from "./dto/export-category-favor.dto";
import { ExportCategorySaleDto } from "./dto/export-category-sale.dto";
import { ExportGoodsInfoList } from "./dto/export-goods-info-list.dto";
import { ExportGoodsInfoDto } from "./dto/export-goods-info.dto";
import { ExportSaleTop10Dto } from "./dto/export-sale-top-10.dto";
import { QueryGoodsInfoDto } from "./dto/query-goods-info.dto";
import { UpdateGoodsInfoDto } from "./dto/update-goods-info.dto";

@Injectable()
export class GoodsInfoService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly prismaService: PrismaService,
		@Inject(forwardRef(() => GoodsCategoryService))
		private readonly goodsCategoryService: GoodsCategoryService,
	) {
		this.logger.setContext(GoodsInfoService.name);
	}

	/**
	 * 创建商品
	 * @param createGoodsInfoDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.GoodsInfoKey)
	async create(createGoodsInfoDto: CreateGoodsInfoDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			const { status, categoryId, ...rest } = createGoodsInfoDto;
			await this.prismaService.goodsInfo.create({
				data: {
					...rest,
					category: {
						connect: {
							id: categoryId,
						},
					},
				},
			});
			return "创建商品成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建商品失败",
				unique: "商品名已存在",
			});
		}
	}

	/**
	 * 更新商品信息
	 * @param id 商品ID
	 * @param updateGoodsInfoDto 更新商品信息
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.GoodsInfoKey)
	async update(id: number, updateGoodsInfoDto: UpdateGoodsInfoDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			//1.判断要更新的商品是否存在
			const findGoodsInfo = await this.findOne(id);
			//2.判断商品分类是否存在
			const category = await this.goodsCategoryService.findOne(
				updateGoodsInfoDto.categoryId || findGoodsInfo.categoryId,
			);
			//3.判断商品分类是否被禁用
			if (!category.enable) {
				throw new BadRequestException("商品分类已禁用");
			}
			//4.更新商品信息
			await this.prismaService.goodsInfo.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					...updateGoodsInfoDto,
					status: updateGoodsInfoDto.status,
				},
			});
			return "更新商品信息成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新商品信息失败",
				unique: "商品名已存在",
			});
		}
	}

	/**
	 * 获取商品列表
	 * @param queryGoodsInfoDto
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsInfoKey)
	async findAll(queryGoodsInfoDto: QueryGoodsInfoDto) {
		this.logger.log(`${this.findAll.name} was called`);
		try {
			const {
				createAt,
				id,
				offset,
				size,
				updateAt,
				address,
				desc,
				favorCount,
				inventoryCount,
				name,
				newPrice,
				oldPrice,
				saleCount,
				status,
				categoryId,
			} = queryGoodsInfoDto;
			const where: Prisma.GoodsInfoWhereInput = {
				id,
				name: {
					contains: name,
				},
				oldPrice: {
					gte: oldPrice?.[0],
					lte: oldPrice?.[1],
				},
				newPrice: {
					gte: newPrice?.[0],
					lte: newPrice?.[1],
				},
				desc: { contains: desc },
				address: { contains: address },
				inventoryCount: { gte: inventoryCount?.[0], lte: inventoryCount?.[1] },
				saleCount: {
					gte: saleCount?.[0],
					lte: saleCount?.[1],
				},
				favorCount: {
					gte: favorCount?.[0],
					lte: favorCount?.[1],
				},
				createAt: {
					gte: createAt?.[0],
					lte: createAt?.[1],
				},
				updateAt: {
					gte: updateAt?.[0],
					lte: updateAt?.[1],
				},
				categoryId,
				status,
				isDelete: false,
			};

			const list = await this.prismaService.goodsInfo.findMany({
				where,
				take: size,
				skip: offset,
				orderBy: {
					id: "desc",
				},
			});

			const totalCount = await this.prismaService.goodsInfo.count({ where });

			const goodsList = plainToInstance(
				ExportGoodsInfoList,
				{
					list,
					totalCount,
				},
				{
					excludeExtraneousValues: true,
				},
			);
			return goodsList;
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品列表失败",
			});
		}
	}

	/**
	 * 获取商品详情
	 * @param id 商品ID
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			const goodsInfo = await this.prismaService.goodsInfo.findUnique({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!goodsInfo) {
				throw new BadRequestException("商品不存在");
			}
			return plainToInstance(ExportGoodsInfoDto, goodsInfo, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品信息失败",
			});
		}
	}

	/**
	 * 删除商品
	 * @param id 商品ID
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.GoodsInfoKey)
	async remove(id: number) {
		this.judgeCanDo(id);
		try {
			const { name } = await this.findOne(id);
			await this.prismaService.goodsInfo.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					isDelete: true,
					name: `已删除_${name}_${getRandomId()}`,
					category: {
						disconnect: true,
					},
				},
			});
			return "删除商品成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除商品失败",
			});
		}
	}

	/**
	 * 根据商品分类id禁用商品
	 * @param id 商品分类id
	 * @returns
	 */
	async changeGoodsInfoStatus(id: number, status: boolean) {
		this.logger.log(`${this.changeGoodsInfoStatus.name} was called`);
		try {
			await this.prismaService.goodsInfo.updateMany({
				where: {
					categoryId: id,
					isDelete: false,
					status: !status,
				},
				data: {
					status,
				},
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "禁用商品失败",
			});
		}
	}

	/**
	 * 获取商品分类数量
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getCategoryCount() {
		this.logger.log(`${this.getCategoryCount.name} was called`);
		try {
			const res = await this.prismaService.goodsCategory.findMany({
				where: {
					isDelete: false,
					enable: true,
				},
				select: {
					id: true,
					name: true,
					_count: true,
				},
			});

			//这里就不用class-transformer了，单纯因为没有提示
			const categoryCountList = res
				.filter((item) => item._count.goods > 0)
				.map((item) => ({
					id: item.id,
					name: item.name,
					goodsCount: item._count.goods,
				}));

			return plainToInstance(ExportCategoryCountDto, categoryCountList, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类数量失败",
			});
		}
	}

	/**
	 * 获取商品分类销量
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getCategorySale() {
		this.logger.log(`${this.getCategorySale.name} was called`);
		try {
			//垃圾prisma
			const res = await this.prismaService.$queryRaw`
				select category.id,category.name,sum(goodsInfo.saleCount) as goodsCount
				from goods_info as goodsInfo
				left join goods_category as category
				on goodsInfo.categoryId = category.id
				where goodsInfo.isDelete = false
				and category.isDelete = false
				and goodsInfo.status = true
				and category.enable = true
				group by category.id
			`;
			return plainToInstance(ExportCategorySaleDto, res, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类销量失败",
			});
		}
	}

	/**
	 * 获取商品分类收藏数
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getCategoryFavor() {
		this.logger.log(`${this.getCategoryFavor.name} was called`);
		try {
			//垃圾prisma
			const categoryFavorList = await this.prismaService.$queryRaw`
				select category.id,category.name,sum(goodsInfo.favorCount) as goodsFavor
				from goods_info as goodsInfo
				left join goods_category as category
				on goodsInfo.categoryId = category.id
				where goodsInfo.isDelete = false
				and category.isDelete = false
				and goodsInfo.status = true
				and category.enable = true
				group by category.id
			`;
			return plainToInstance(ExportCategoryFavorDto, categoryFavorList, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类收藏数失败",
			});
		}
	}

	/**
	 * 获取商品销量top10
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getSaleTop10() {
		this.logger.log(`${this.getSaleTop10.name} was called`);
		try {
			const saleTop10List = await this.prismaService.goodsInfo.findMany({
				select: {
					id: true,
					name: true,
					saleCount: true,
				},
				where: {
					isDelete: false,
				},
				orderBy: {
					saleCount: "desc",
				},
				take: 10,
			});
			return plainToInstance(ExportSaleTop10Dto, saleTop10List, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品销量top10失败",
			});
		}
	}

	/**
	 * 获取发货地销量
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getAddressSale() {
		this.logger.log(`${this.getAddressSale.name} was called`);
		try {
			const res = await this.prismaService.goodsInfo.groupBy({
				by: ["address"],
				_sum: {
					saleCount: true,
				},
				where: {
					isDelete: false,
					saleCount: {
						gt: 0,
					},
				},
			});

			const addressSaleList = res.map((item) => ({
				address: item.address,
				count: item._sum.saleCount,
			}));

			return plainToInstance(ExportAddressSaleDto, addressSaleList, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品发货地销量失败",
			});
		}
	}

	/**
	 * 获取商品统计数量
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
	async getAmountCounts() {
		this.logger.log(`${this.getAmountCounts.name} was called`);
		try {
			//垃圾prisma
			const [{ favor, inventory, sale, saleroom }] = await this.prismaService
				.$queryRaw<
				{
					sale: string;
					favor: string;
					inventory: string;
					saleroom: string;
				}[]
			>`
					select sum(goodsInfo.saleCount) as sale,
					sum(goodsInfo.favorCount) as favor,
					sum(goodsInfo.inventoryCount) as inventory,
					sum(goodsInfo.saleCount * goodsInfo.newPrice) as saleroom
					from goods_info as goodsInfo
					where goodsInfo.isDelete = false
			`;
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
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品统计信息失败",
			});
		}
	}

	judgeCanDo(id: number) {
		if (id <= 183) {
			throw new ForbiddenException("系统商品不可操作");
		}
	}
}
