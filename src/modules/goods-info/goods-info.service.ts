/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:50:10
 * @FilePath: \cms\src\modules\goods-info\goods-info.service.ts
 * @Description:
 */
import { GoodsInfo } from "@/shared/entities/goods-info.entity";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { filterEmpty } from "@/shared/utils/filer-empty";
import { moreAndBetweenCondition } from "@/shared/utils/typeorm-condition";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Between, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
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
		@InjectRepository(GoodsInfo)
		private readonly goodsInfoRepository: Repository<GoodsInfo>,
		private readonly redisService: RedisService,
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
	async create(createGoodsInfoDto: CreateGoodsInfoDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			const { status, categoryId, ...rest } = createGoodsInfoDto;
			const category = await this.goodsCategoryService.findOne(categoryId);
			const goodsInfo = this.goodsInfoRepository.create({
				...rest,
				enable: !!status,
				category: plainToInstance(GoodsInfo, category),
			});
			await this.goodsInfoRepository.save(goodsInfo);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "创建商品成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno === 1062
			) {
				throw new BadRequestException("商品名已存在");
			}
			throw new BadRequestException("创建商品失败");
		}
	}

	/**
	 * 更新商品信息
	 * @param id 商品ID
	 * @param updateGoodsInfoDto 更新商品信息
	 * @returns
	 */
	async update(id: number, updateGoodsInfoDto: UpdateGoodsInfoDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			const { status } = updateGoodsInfoDto;
			//1.判断要更新的商品是否存在
			const findGoodsInfo = await this.findOne(id);
			//2.判断商品分类是否存在
			const category = await this.goodsCategoryService.findOne(
				updateGoodsInfoDto.categoryId || findGoodsInfo.categoryId,
			);

			//3.判断商品分类是否被禁用
			let enable = undefined;
			if (status !== undefined) {
				if (!category.enable) {
					throw new BadRequestException("商品分类已禁用");
				} else {
					enable = !!status;
				}
			}

			//4.更新商品信息
			const goodsInfo = this.goodsInfoRepository.create({
				...updateGoodsInfoDto,
				enable,
				category: {
					id: updateGoodsInfoDto.categoryId || findGoodsInfo.categoryId,
				},
			});
			await this.goodsInfoRepository.save({
				id,
				isDelete: false,
				...goodsInfo,
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "更新商品信息成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno === 1062
			) {
				throw new BadRequestException("商品名已存在");
			}
			if (error.message) {
				throw new BadRequestException(error.message);
			}
			throw new BadRequestException("更新商品信息失败");
		}
	}

	/**
	 * 获取商品列表
	 * @param queryGoodsInfoDto
	 * @returns
	 */
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

			const filterQueryGoodsInfoDto = filterEmpty(queryGoodsInfoDto);
			const redisGoodsInfoList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + JSON.stringify(filterQueryGoodsInfoDto),
			);
			if (redisGoodsInfoList) return redisGoodsInfoList;

			const [list, totalCount] = await this.goodsInfoRepository.findAndCount({
				select: {
					category: {
						id: true,
					},
				},
				where: {
					id,
					name: name && Like(`%${name}%`),
					oldPrice: moreAndBetweenCondition(oldPrice),
					newPrice: moreAndBetweenCondition(newPrice),
					desc: desc && Like(`%${desc}%`),
					address: address && Like(`%${address}%`),
					inventoryCount: moreAndBetweenCondition(inventoryCount),
					saleCount: moreAndBetweenCondition(saleCount),
					favorCount: moreAndBetweenCondition(favorCount),
					enable: status && !!status,
					createAt: createAt && Between(createAt[0], createAt[1]),
					updateAt: updateAt && Between(updateAt[0], updateAt[1]),
					category: categoryId && { id: categoryId },
					isDelete: false,
				},
				take: size,
				skip: offset,
				order: {
					id: "DESC",
				},
				relations: ["category"],
			});

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

			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + JSON.stringify(filterQueryGoodsInfoDto),
				goodsList,
			);
			return goodsList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品列表失败");
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
			if (!id) throw new BadRequestException("商品不存在");
			const goodsInfo = await this.goodsInfoRepository.findOne({
				select: {
					category: {
						id: true,
					},
				},
				where: {
					id,
					isDelete: false,
				},
				relations: {
					category: true,
				},
			});
			if (!goodsInfo) {
				throw new BadRequestException("商品不存在");
			}
			return plainToInstance(ExportGoodsInfoDto, goodsInfo, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) {
				throw new BadRequestException(error.message);
			}
			throw new BadRequestException("获取商品信息失败");
		}
	}

	/**
	 * 删除商品
	 * @param id 商品ID
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const { name } = await this.findOne(id);
			await this.goodsInfoRepository.save({
				id,
				isDelete: true,
				name: `已删除_${name}_${UUID()}`,
				category: null,
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "删除商品成功~";
		} catch (error) {
			this.logger.log(error);
			if (error.message) {
				throw new BadRequestException(error.message);
			}
			throw new BadRequestException("删除商品失败");
		}
	}

	/**
	 * 根据商品分类id禁用商品
	 * @param id 商品分类id
	 * @returns
	 */
	async disableMany(id: number) {
		try {
			this.logger.log(`${this.disableMany.name} was called`);
			await this.goodsInfoRepository.update(
				{
					category: {
						id,
						isDelete: false,
					},
					enable: true,
				},
				{ enable: false },
			);
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("禁用商品失败");
		}
	}

	/**
	 * 获取商品分类数量
	 * @returns
	 */
	async getCategoryCount() {
		this.logger.log(`${this.getCategoryCount.name} was called`);
		try {
			const redisCategoryCountList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getCategoryCount.name,
			);
			if (redisCategoryCountList) return redisCategoryCountList;

			const categoryCountList = await this.goodsInfoRepository
				.createQueryBuilder("goodsInfo")
				.leftJoinAndSelect("goodsInfo.category", "category")
				.select("category.id", "id")
				.addSelect("category.name", "name")
				.addSelect("count(*)", "goodsCount")
				.where("goodsInfo.isDelete = false")
				.where("category.isDelete = false")
				.groupBy("id")
				.having("goodsCount > 0")
				.getRawMany();

			const exportCategoryCountList = plainToInstance(
				ExportCategoryCountDto,
				categoryCountList,
				{
					excludeExtraneousValues: true,
				},
			);
			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getCategoryCount.name,
				exportCategoryCountList,
			);
			return exportCategoryCountList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品分类数量失败");
		}
	}

	/**
	 * 获取商品分类销量
	 * @returns
	 */
	async getCategorySale() {
		this.logger.log(`${this.getCategorySale.name} was called`);
		try {
			const redisCategorySaleList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getCategorySale.name,
			);
			if (redisCategorySaleList) return redisCategorySaleList;

			const categorySaleList = await this.goodsInfoRepository
				.createQueryBuilder("goodsInfo")
				.leftJoinAndSelect("goodsInfo.category", "category")
				.select("category.id", "id")
				.addSelect("category.name", "name")
				.addSelect("sum(goodsInfo.saleCount)", "goodsCount")
				.where("goodsInfo.isDelete = false")
				.where("category.isDelete = false")
				.groupBy("id")
				.having("sum(goodsInfo.saleCount) > 0")
				.getRawMany();
			const exportCategorySaleList = plainToInstance(
				ExportCategorySaleDto,
				categorySaleList,
				{
					excludeExtraneousValues: true,
				},
			);
			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getCategorySale.name,
				exportCategorySaleList,
			);
			return exportCategorySaleList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品分类销量失败");
		}
	}

	/**
	 * 获取商品分类收藏数
	 * @returns
	 */
	async getCategoryFavor() {
		this.logger.log(`${this.getCategoryFavor.name} was called`);
		try {
			const redisCategoryFavorList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getCategoryFavor.name,
			);
			if (redisCategoryFavorList) return redisCategoryFavorList;

			const categoryFavorList = await this.goodsInfoRepository
				.createQueryBuilder("goodsInfo")
				.leftJoinAndSelect("goodsInfo.category", "category")
				.select("category.id", "id")
				.addSelect("category.name", "name")
				.addSelect("sum(goodsInfo.favorCount)", "goodsFavor")
				.where("goodsInfo.isDelete = false")
				.where("category.isDelete = false")
				.groupBy("id")
				.having("sum(goodsInfo.favorCount) > 0")
				.getRawMany();

			const exportCategoryFavorList = plainToInstance(
				ExportCategoryFavorDto,
				categoryFavorList,
				{
					excludeExtraneousValues: true,
				},
			);

			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getCategoryFavor.name,
				exportCategoryFavorList,
			);

			return exportCategoryFavorList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品分类收藏数失败");
		}
	}

	/**
	 * 获取商品销量top10
	 * @returns
	 */
	async getSaleTop10() {
		this.logger.log(`${this.getSaleTop10.name} was called`);
		try {
			const redisSaleTop10List = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getSaleTop10.name,
			);
			if (redisSaleTop10List) return redisSaleTop10List;

			const saleTop10List = await this.goodsInfoRepository.find({
				select: {
					id: true,
					name: true,
					saleCount: true,
				},
				where: {
					isDelete: false,
				},
				order: {
					saleCount: "DESC",
				},
				take: 10,
			});

			const exportSaleTop10List = plainToInstance(
				ExportSaleTop10Dto,
				saleTop10List,
				{
					excludeExtraneousValues: true,
				},
			);

			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getSaleTop10.name,
				exportSaleTop10List,
			);

			return exportSaleTop10List;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品销量top10失败");
		}
	}

	/**
	 * 获取发货地销量
	 * @returns
	 */
	async getAddressSale() {
		this.logger.log(`${this.getAddressSale.name} was called`);
		try {
			const redisAddressSaleList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getAddressSale.name,
			);

			if (redisAddressSaleList) return redisAddressSaleList;

			const addressSaleList = await this.goodsInfoRepository
				.createQueryBuilder("goodsInfo")
				.select("goodsInfo.address", "address")
				.addSelect("sum(goodsInfo.saleCount)", "count")
				.where("goodsInfo.isDelete = false")
				.groupBy("address")
				.having("count > 0")
				.getRawMany();

			const exportAddressSaleList = plainToInstance(
				ExportAddressSaleDto,
				addressSaleList,
				{
					excludeExtraneousValues: true,
				},
			);

			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getAddressSale.name,
				exportAddressSaleList,
			);

			return exportAddressSaleList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品发货地销量失败");
		}
	}

	/**
	 * 获取商品统计数量
	 * @returns
	 */
	async getAmountCounts() {
		this.logger.log(`${this.getAmountCounts.name} was called`);
		try {
			const redisAmountCountsList = await this.redisService._get(
				RedisKeyEnum.GoodsInfoKey + this.getAmountCounts.name,
			);
			if (redisAmountCountsList) return redisAmountCountsList;

			const { sale, favor, inventory, saleroom } =
				await this.goodsInfoRepository
					.createQueryBuilder("goodsInfo")
					.select("sum(goodsInfo.saleCount)", "sale")
					.addSelect("sum(goodsInfo.favorCount)", "favor")
					.addSelect("sum(goodsInfo.inventoryCount)", "inventory")
					.addSelect(
						"sum(goodsInfo.saleCount * goodsInfo.newPrice)",
						"saleroom",
					)
					.where("goodsInfo.isDelete = false")
					.getRawOne();
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

			const exportAmountList = plainToInstance(ExportAmoutListDto, amountList, {
				excludeExtraneousValues: true,
			});
			this.redisService._set(
				RedisKeyEnum.GoodsInfoKey + this.getAmountCounts.name,
				exportAmountList,
			);
			return exportAmountList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品统计信息失败");
		}
	}

	judgeCanDo(id: number) {
		if (id <= 183) {
			throw new ForbiddenException("系统商品不可操作");
		}
	}
}
