/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:57
 * @FilePath: \cms\src\modules\story\story.service.ts
 * @Description:
 */
import { Story } from "@/shared/entities/story.entity";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { filterEmpty } from "@/shared/utils/filer-empty";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { Between, Like, Repository } from "typeorm";
import { CreateStoryDto } from "./dto/create-story.dto";
import { ExportStoryListDto } from "./dto/export-story-list.dto";
import { ExportExportDto } from "./dto/export-story.dto";
import { QueryStoryDto } from "./dto/query-story.dto";
import { UpdateStoryDto } from "./dto/update-story.dto";

@Injectable()
export class StoryService {
	constructor(
		private readonly logger: AppLoggerSevice,
		@InjectRepository(Story)
		private readonly storyRepository: Repository<Story>,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(StoryService.name);
	}

	/**
	 * 创建故事
	 * @param createStoryDto
	 * @returns
	 */
	async create(createStoryDto: CreateStoryDto) {
		this.logger.log(`${this.create.name} was called`);

		try {
			const { content, title } = createStoryDto;
			// 进行xss过滤
			const window = new JSDOM("").window;
			const purify = DOMPurify(window);
			const cleanContent = purify.sanitize(content);
			await this.storyRepository.save({
				title,
				content: cleanContent,
			});

			this.redisService._delKeysWithPrefix(RedisKeyEnum.StoryKey);
			return "创建故事成功~";
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("创建故事失败");
		}
	}

	/**
	 * 查询故事列表
	 * @param queryStoryDto
	 * @returns
	 */
	async findAll(queryStoryDto: QueryStoryDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const { createAt, enable, id, offset, size, title, updateAt } =
				queryStoryDto;

			const filterQueryStoryDto = filterEmpty(queryStoryDto);
			const redisStoryList = await this.redisService._get(
				RedisKeyEnum.StoryKey + JSON.stringify(filterQueryStoryDto),
			);
			if (redisStoryList) return redisStoryList;

			const [list, totalCount] = await this.storyRepository.findAndCount({
				where: {
					id,
					title: title && Like(`%${title}%`),
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
			});

			const storyList = plainToInstance(
				ExportStoryListDto,
				{
					list,
					totalCount,
				},
				{ excludeExtraneousValues: true },
			);
			this.redisService._set(
				RedisKeyEnum.StoryKey + JSON.stringify(filterQueryStoryDto),
				storyList,
			);
			return storyList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("查询故事列表失败");
		}
	}

	/**
	 * 查询故事详情
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			if (!id) throw new BadRequestException("故事不存在");
			const story = await this.storyRepository.findOne({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!story) {
				throw new BadRequestException("故事不存在");
			}
			return plainToInstance(ExportExportDto, story, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) {
				throw new BadRequestException(error.message);
			}
			throw new BadRequestException("查询故事失败");
		}
	}

	/**
	 * 更新故事
	 * @param id
	 * @param updateStoryDto
	 * @returns
	 */
	async update(id: number, updateStoryDto: UpdateStoryDto) {
		this.judgeCanDo(id);

		try {
			await this.findOne(id);
			const { content, title } = updateStoryDto;
			let cleanContent = undefined;
			// 如果有内容，就进行xss过滤
			if (content) {
				const window = new JSDOM("").window;
				const purify = DOMPurify(window);
				cleanContent = purify.sanitize(content);
			}
			await this.storyRepository.update(
				{
					id,
					isDelete: false,
				},
				{
					content: cleanContent,
					title,
				},
			);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.StoryKey);
			return "更新故事成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("更新故事失败");
		}
	}

	/**
	 * 删除故事
	 * @param id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.findOne(id);
			await this.storyRepository.update(
				{ id, isDelete: false },
				{
					isDelete: true,
				},
			);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.StoryKey);
			return "删除故事成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除故事失败");
		}
	}

	/**
	 * 判断是否能操作
	 * @param id
	 */
	judgeCanDo(id: number) {
		if (id <= 2) {
			throw new ForbiddenException("系统故事不能操作");
		}
	}
}
