/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:57
 * @FilePath: \cms\src\modules\story\story.service.ts
 * @Description:
 */
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { CreateStoryDto } from "./dto/create-story.dto";
import { ExportStoryListDto } from "./dto/export-story-list.dto";
import { ExportExportDto } from "./dto/export-story.dto";
import { QueryStoryDto } from "./dto/query-story.dto";
import { UpdateStoryDto } from "./dto/update-story.dto";
@Injectable()
export class StoryService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly prismaService: PrismaService,
	) {
		this.logger.setContext(StoryService.name);
	}

	/**
	 * 创建故事
	 * @param createStoryDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.StoryKey)
	async create(createStoryDto: CreateStoryDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			const { content, title } = createStoryDto;
			// 进行xss过滤
			const window = new JSDOM("").window;
			const purify = DOMPurify(window);
			const cleanContent = purify.sanitize(content);
			await this.prismaService.story.create({
				data: {
					title,
					content: cleanContent,
				},
			});
			return "创建故事成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建故事失败",
			});
		}
	}

	/**
	 * 查询故事列表
	 * @param queryStoryDto
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.StoryKey)
	async findAll(queryStoryDto: QueryStoryDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const { createAt, enable, id, offset, size, title, updateAt } =
				queryStoryDto;

			const where: Prisma.StoryWhereInput = {
				id,
				title: {
					contains: title,
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

			const [list, totalCount] = await this.prismaService.$transaction([
				this.prismaService.story.findMany({
					where,
					skip: offset,
					take: size,
					orderBy: {
						id: "desc",
					},
				}),
				this.prismaService.story.count({ where }),
			]);

			return plainToInstance(
				ExportStoryListDto,
				{
					list,
					totalCount,
				},
				{ excludeExtraneousValues: true },
			);
		} catch (error) {
			handleError(this.logger, error, {
				common: "查询故事列表失败",
			});
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
			const story = await this.prismaService.story.findUnique({
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
			handleError(this.logger, error, {
				common: "查询故事失败",
			});
		}
	}

	/**
	 * 更新故事
	 * @param id
	 * @param updateStoryDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.StoryKey)
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
			await this.prismaService.story.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					content: cleanContent,
					title,
				},
			});
			return "更新故事成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新故事失败",
			});
		}
	}

	/**
	 * 删除故事
	 * @param id
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.StoryKey)
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.findOne(id);
			await this.prismaService.story.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					isDelete: true,
				},
			});
			return "删除故事成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除故事失败",
			});
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
