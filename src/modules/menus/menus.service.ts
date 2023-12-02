/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:19:51
 * @FilePath: \cms\src\modules\menus\menus.service.ts
 * @Description:
 */
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { generateTree, getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { ExportMenuDto } from "./dto/export-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Injectable()
export class MenusService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly prismaService: PrismaService,
	) {
		this.logger.setContext(MenusService.name);
	}

	/**
	 * 创建菜单
	 * @param createMenuDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.MenuKey)
	async create(createMenuDto: CreateMenuDto) {
		this.logger.log(`${this.create.name} was called`);
		const { parentId, ...rest } = createMenuDto;
		try {
			// 如果有父级id，就创建子菜单
			if (parentId) {
				// 保存子菜单
				await this.prismaService.menu.create({
					data: {
						...rest,
						parentId,
					},
				});
				return "创建菜单成功";
			}
			// 如果没有父级id，就保存一级菜单
			await this.prismaService.menu.create({
				data: rest,
			});
			return "创建菜单成功";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建菜单失败",
				unique: "菜单名已存在",
			});
		}
	}

	/**
	 * 查询所有菜单
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.MenuKey)
	async findAll() {
		this.logger.log(`${this.findAll.name} was called`);
		try {
			const menuListTrees = await this.prismaService.menu.findMany({
				where: {
					isDelete: false,
				},
			});
			return plainToInstance(ExportMenuDto, generateTree(menuListTrees), {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "查找菜单失败",
			});
		}
	}

	/**
	 * 查询所有菜单id
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.MenuKey)
	async findAllIds() {
		this.logger.log(`${this.findAllIds.name} was called`);
		const menuList = await this.prismaService.menu.findMany({
			select: {
				id: true,
			},
			where: {
				isDelete: false,
			},
		});
		return menuList.map((item) => item.id);
	}

	/**
	 * 根据id查找菜单
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.error(`${this.findOne.name} was called`);
		try {
			if (!id) throw new BadRequestException("菜单不存在");
			const menu = await this.prismaService.menu.findUnique({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!menu) throw new BadRequestException("菜单不存在");
			return plainToInstance(ExportMenuDto, menu, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "查找菜单失败",
			});
		}
	}

	/**
	 * 更新菜单
	 * @param id
	 * @param updateMenuDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.MenuKey, RedisKeyEnum.RoleKey)
	async update(id: number, updateMenuDto: UpdateMenuDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.findOne(id);
			await this.prismaService.menu.update({
				where: {
					id,
					isDelete: false,
				},
				data: updateMenuDto,
			});
			return "更新菜单成功";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新菜单失败",
				unique: "菜单名已存在",
			});
		}
	}

	/**
	 * 删除菜单
	 * @param id
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.MenuKey, RedisKeyEnum.RoleKey)
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const menu = await this.findOne(id);
			await this.prismaService.menu.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					isDelete: true,
					name: "已删除" + "_" + menu.name + "_" + getRandomId(),
					roleMenu: {
						deleteMany: {},
					},
				},
			});
			return "删除菜单成功";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除菜单失败",
			});
		}
	}

	/**
	 * 根据id数组查找菜单
	 * @param ids
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.MenuKey)
	async findListByIds(ids: number[]) {
		try {
			return await this.prismaService.menu.findMany({
				where: {
					id: {
						in: ids,
					},
					isDelete: false,
				},
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "查找菜单失败",
			});
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 * @returns
	 */
	judgeCanDo(id: number) {
		if (id <= 44) {
			throw new ForbiddenException("系统菜单不能操作");
		}
	}
}
