/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:28:10
 * @FilePath: \cms\src\modules\goods-category\goods-category.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { RedisService } from "@/shared/redis";
import { filterEmpty, getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { GoodsInfoService } from "../goods-info/goods-info.service";
import { CreateGoodsCategoryDto } from "./dto/create-goods-category.dto";
import { ExportGoodsCategoryListDto } from "./dto/export-goods-category-list";
import { ExportGoodsCategoryDto } from "./dto/export-goods-category.dto";
import { QueryGoodsCategoryDto } from "./dto/query-goods-category.dto";
import { UpdateGoodsCategoryDto } from "./dto/update-goods-category.dto";

@Injectable()
export class GoodsCategoryService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly redisService: RedisService,
		private readonly prismaService: PrismaService,
		@Inject(forwardRef(() => GoodsInfoService))
		private readonly goodsInfoService: WrapperType<GoodsInfoService>,
	) {
		this.logger.setContext(GoodsCategoryService.name);
	}

	/**
	 * 创建商品分类
	 * @param createGoodsCategoryDto
	 * @returns
	 */
	async create(createGoodsCategoryDto: CreateGoodsCategoryDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			await this.prismaService.goodsCategory.create({
				data: createGoodsCategoryDto,
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			return "创建商品分类成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建商品分类失败",
				unique: "商品分类名已存在",
			});
		}
	}

	/**
	 * 获取商品分类列表
	 * @param queryGoodsCategoryDto
	 * @returns
	 */
	async findAll(queryGoodsCategoryDto: QueryGoodsCategoryDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const { createAt, enable, id, name, offset, size, updateAt } =
				queryGoodsCategoryDto;

			const filterQueryGoodsCategory = filterEmpty(queryGoodsCategoryDto);
			const redisGoodsCategoryList = await this.redisService._get(
				RedisKeyEnum.GoodsCategoryKey +
					JSON.stringify(filterQueryGoodsCategory),
			);
			if (redisGoodsCategoryList) return redisGoodsCategoryList;

			const where: Prisma.GoodsCategoryWhereInput = {
				id,
				name: {
					contains: name,
				},
				enable: enable && !!enable,
				createAt: {
					in: createAt,
				},
				updateAt: {
					in: updateAt,
				},
				isDelete: false,
			};
			const list = await this.prismaService.goodsCategory.findMany({
				where,
				skip: offset,
				take: size,
				orderBy: {
					id: "desc",
				},
			});
			const totalCount = await this.prismaService.goodsCategory.count({
				where,
			});
			const goodCategoryList = plainToInstance(
				ExportGoodsCategoryListDto,
				{
					list,
					totalCount,
				},
				{
					excludeExtraneousValues: true,
				},
			);
			this.redisService._set(
				RedisKeyEnum.GoodsCategoryKey +
					JSON.stringify(filterQueryGoodsCategory),
				goodCategoryList,
			);
			return goodCategoryList;
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类列表失败",
			});
		}
	}

	/**
	 * 获取商品分类列表
	 * @returns
	 */
	async findAllCategory() {
		this.logger.log(`${this.findAllCategory.name} was called`);
		try {
			const redisCategoryList = await this.redisService._get(
				RedisKeyEnum.GoodsCategoryKey,
			);
			if (redisCategoryList) return redisCategoryList;
			const categoryList = await this.prismaService.goodsCategory.findMany({
				select: {
					id: true,
					name: true,
				},
				where: {
					isDelete: false,
					enable: true,
				},
				orderBy: {
					id: "desc",
				},
			});
			this.redisService._set(RedisKeyEnum.GoodsCategoryKey, categoryList);
			return categoryList;
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类列表失败",
			});
		}
	}

	/**
	 * 获取商品分类详情
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			const goodsCategory = await this.prismaService.goodsCategory.findUnique({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!goodsCategory) throw new BadRequestException("商品分类不存在");
			return plainToInstance(ExportGoodsCategoryDto, goodsCategory, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取商品分类失败",
			});
		}
	}

	/**
	 * 更新商品分类
	 * @param id
	 * @param updateGoodsCategoryDto
	 * @returns
	 */
	async update(id: number, updateGoodsCategoryDto: UpdateGoodsCategoryDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.findOne(id);
			await this.prismaService.goodsCategory.update({
				where: {
					id,
					isDelete: false,
				},
				data: updateGoodsCategoryDto,
			});
			if (updateGoodsCategoryDto.enable === false) {
				this.goodsInfoService.disableMany(id);
			}
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "更新商品分类成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新商品分类失败",
				unique: "商品分类名已存在",
			});
		}
	}

	/**
	 * 删除商品分类
	 * @param id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const goodsCategory = await this.findOne(id);
			await this.prismaService.goodsCategory.update({
				data: {
					id,
					name: `已删除_${goodsCategory.name}_${getRandomId()}`,
					isDelete: true,
					goods: {
						set: [],
					},
				},
				where: {
					id,
					isDelete: false,
				},
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "删除商品分类成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除商品分类失败",
			});
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 */
	judgeCanDo(id: number) {
		if (id <= 8) {
			throw new ForbiddenException("系统商品分类不可操作");
		}
	}
}
