import { GoodsCategory } from "@/shared/entities/goods-category.entity";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Between, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
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
				},
			);

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
			await this.goodCategoryRepository.update(
				{ id, isDelete: false },
				updateGoodsCategoryDto,
			);
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

			await this.goodCategoryRepository.update(
				{
					id,
					isDelete: false,
				},
				{
					name: `已删除_${goodsCategory.name}_${UUID()}`,
					isDelete: true,
				},
			);
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
		if (id === 6) {
			throw new BadRequestException("系统商品分类不可操作");
		}
	}
}
