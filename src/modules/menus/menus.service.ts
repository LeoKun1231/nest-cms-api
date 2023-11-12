import { Menu } from "@/shared/entities/menu.entity";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { filterTree } from "@/shared/utils/filter-tree";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { In, QueryFailedError, TreeRepository } from "typeorm";
import { v1 as UUID } from "uuid";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { ExportMenuDto } from "./dto/export-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Injectable()
export class MenusService {
	constructor(
		private readonly logger: AppLoggerSevice,
		@InjectRepository(Menu)
		private readonly menuRepository: TreeRepository<Menu>,
	) {
		this.logger.setContext(MenusService.name);
	}

	/**
	 * 创建菜单
	 * @param createMenuDto
	 * @returns
	 */
	async create(createMenuDto: CreateMenuDto) {
		this.logger.log(`${this.create.name} was called`);
		const { parentId, ...rest } = createMenuDto;
		try {
			// 如果有父级id，就创建子菜单
			if (parentId) {
				// 根据父级id查找父级菜单
				const parent = await this.menuRepository.findOneBy({ id: parentId });
				// 创建子菜单
				const menu = await this.menuRepository.create({
					...rest,
					parent,
				});
				// 保存子菜单
				await this.menuRepository.save(menu);
				return "创建菜单成功";
			}
			// 如果没有父级id，就创建一级菜单
			const menu = await this.menuRepository.create({
				...rest,
			});
			// 保存一级菜单
			await this.menuRepository.save(menu);
			return "创建菜单成功";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("菜单名已存在");
			}
			throw new BadRequestException("创建菜单失败");
		}
	}

	/**
	 * 查询所有菜单
	 * @returns
	 */
	async findAll() {
		this.logger.log(`${this.findAll.name} was called`);
		try {
			const menuList = await this.menuRepository.findTrees();
			return plainToInstance(ExportMenuDto, filterTree<Menu>(menuList), {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("查找菜单失败");
		}
	}

	/**
	 * 根据id查找菜单
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			const menu = await this.menuRepository.findOne({
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
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("查找菜单失败");
		}
	}

	/**
	 * 更新菜单
	 * @param id
	 * @param updateMenuDto
	 * @returns
	 */
	async update(id: number, updateMenuDto: UpdateMenuDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.menuRepository.update(
				{
					id,
					isDelete: false,
				},
				updateMenuDto,
			);
			return "更新菜单成功";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("菜单名已存在");
			}
			throw new BadRequestException("更新菜单失败");
		}
	}

	/**
	 * 删除菜单
	 * @param id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const menu = await this.findOne(id);
			await this.menuRepository.update(
				{ isDelete: false, id },
				{
					isDelete: true,
					name: "已删除" + "_" + menu.name + "_" + UUID(),
				},
			);
			return "删除菜单成功";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除菜单失败");
		}
	}

	/**
	 * 根据id数组查找菜单
	 * @param ids
	 * @returns
	 */
	async findListByIds(ids: number[]) {
		this.logger.log(`${this.findListByIds.name} was called`);
		try {
			return await this.menuRepository.find({
				where: {
					id: In(ids),
					isDelete: false,
					enable: true,
				},
			});
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("查找菜单失败");
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 * @returns
	 */
	judgeCanDo(id: number) {
		if (id <= 44) {
			throw new BadRequestException("系统菜单不能操作");
		}
	}
}
