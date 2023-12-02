/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:28:10
 * @FilePath: \cms\src\modules\goods-category\goods-category.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
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
	@CacheEvict(RedisKeyEnum.GoodsCategoryKey)
	async create(createGoodsCategoryDto: CreateGoodsCategoryDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			await this.prismaService.goodsCategory.create({
				data: createGoodsCategoryDto,
			});
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
	@Cacheable(RedisKeyEnum.GoodsCategoryKey)
	async findAll(queryGoodsCategoryDto: QueryGoodsCategoryDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const { createAt, enable, id, name, offset, size, updateAt } =
				queryGoodsCategoryDto;
			const where: Prisma.GoodsCategoryWhereInput = {
				id,
				name: {
					contains: name,
				},
				enable,
				createAt: {
					gte: createAt?.[0],
					lte: createAt?.[1],
				},
				updateAt: {
					gte: updateAt?.[0],
					lte: updateAt?.[1],
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

			return plainToInstance(
				ExportGoodsCategoryListDto,
				{
					list,
					totalCount,
				},
				{
					excludeExtraneousValues: true,
				},
			);
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
	@Cacheable(RedisKeyEnum.GoodsCategoryKey)
	async findAllCategory() {
		this.logger.log(`${this.findAllCategory.name} was called`);
		try {
			return await this.prismaService.goodsCategory.findMany({
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
	@CacheEvict(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
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
			if (updateGoodsCategoryDto.enable != undefined) {
				await this.goodsInfoService.changeGoodsInfoStatus(
					id,
					updateGoodsCategoryDto.enable,
				);
			}
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
	@CacheEvict(RedisKeyEnum.GoodsCategoryKey, RedisKeyEnum.GoodsInfoKey)
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
