/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:28:10
 * @FilePath: \cms\src\modules\goods-category\goods-category.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
import { GoodsCategory } from "@/shared/entities/goods-category.entity";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { filterEmpty } from "@/shared/utils/filer-empty";
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
		@InjectRepository(GoodsCategory)
		private readonly goodCategoryRepository: Repository<GoodsCategory>,
		private readonly redisService: RedisService,
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
			await this.goodCategoryRepository.save(createGoodsCategoryDto);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			return "创建商品分类成功~";
		} catch (error) {
			this.logger.error(error);
			if (error instanceof QueryFailedError && error.driverError.errno === 1062)
				throw new BadRequestException("商品分类名已存在");
			throw new BadRequestException("创建商品分类失败");
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

			const [list, totalCount] = await this.goodCategoryRepository.findAndCount(
				{
					where: {
						id,
						name: name && Like(`%${name}%`),
						enable: enable && !!enable,
						createAt: createAt && Between(createAt[0], createAt[1]),
						updateAt: updateAt && Between(updateAt[0], updateAt[1]),
						isDelete: false,
					},
					skip: offset,
					take: size,
					order: {
						id: "DESC",
					},
				},
			);
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
			this.logger.error(error);
			throw new BadRequestException("获取商品分类列表失败");
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
			const categoryList = await this.goodCategoryRepository.find({
				select: {
					id: true,
					name: true,
				},
				where: {
					isDelete: false,
					enable: true,
				},
				order: {
					id: "DESC",
				},
			});
			this.redisService._set(RedisKeyEnum.GoodsCategoryKey, categoryList);
			return categoryList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取商品分类列表失败");
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
			if (!id) throw new BadRequestException("商品分类不存在");
			const goodsCategory = await this.goodCategoryRepository.findOne({
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
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("获取商品分类失败");
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
			await this.goodCategoryRepository.save({
				id,
				isDelete: false,
				...updateGoodsCategoryDto,
			});
			if (updateGoodsCategoryDto.enable === false) {
				this.goodsInfoService.disableMany(id);
			}
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "更新商品分类成功~";
		} catch (error) {
			this.logger.error(error);
			if (error instanceof QueryFailedError && error.driverError.errno === 1062)
				throw new BadRequestException("商品分类名已存在");
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("更新商品分类失败");
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
			await this.goodCategoryRepository.save({
				id,
				name: `已删除_${goodsCategory.name}_${UUID()}`,
				isDelete: true,
				goods: [],
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsCategoryKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.GoodsInfoKey);
			return "删除商品分类成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除商品分类失败");
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
