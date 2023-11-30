/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:19:51
 * @FilePath: \cms\src\modules\menus\menus.service.ts
 * @Description:
 */
import { AppLoggerSevice } from "@/shared/logger";
import { RedisService } from "@/shared/redis";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Injectable()
export class MenusService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(MenusService.name);
	}

	/**
	 * 创建菜单
	 * @param createMenuDto
	 * @returns
	 */
	async create(createMenuDto: CreateMenuDto) {
		// this.logger.log(`${this.create.name} was called`);
		// const { parentId, ...rest } = createMenuDto;
		// try {
		// 	// 如果有父级id，就创建子菜单
		// 	if (parentId) {
		// 		// 根据父级id查找父级菜单
		// 		const parent = await this.menuRepository.findOneBy({ id: parentId });
		// 		// 创建子菜单
		// 		const menu = this.menuRepository.create({
		// 			...rest,
		// 			parent,
		// 		});
		// 		// 保存子菜单
		// 		await this.menuRepository.save(menu);
		// 		return "创建菜单成功";
		// 	}
		// 	// 如果没有父级id，就创建一级菜单
		// 	const menu = await this.menuRepository.create({
		// 		...rest,
		// 	});
		// 	// 保存一级菜单
		// 	await this.menuRepository.save(menu);
		// 	await this.redisService._delKeysWithPrefix(RedisKeyEnum.MenuKey);
		// 	return "创建菜单成功";
		// } catch (error) {
		// 	this.logger.error(error);
		// 	if (
		// 		error instanceof QueryFailedError &&
		// 		error.driverError.errno == 1062
		// 	) {
		// 		throw new BadRequestException("菜单名已存在");
		// 	}
		// 	throw new BadRequestException("创建菜单失败");
		// }
	}

	/**
	 * 查询所有菜单
	 * @returns
	 */
	async findAll() {
		// this.logger.log(`${this.findAll.name} was called`);
		// try {
		// 	const redisMenuList = await this.redisService.get(RedisKeyEnum.MenuKey);
		// 	if (redisMenuList) return JSON.parse(redisMenuList);
		// 	const menuListTrees = await this.menuRepository.findTrees();
		// 	const menuList = plainToInstance(
		// 		ExportMenuDto,
		// 		filterTree<Menu>(menuListTrees),
		// 		{
		// 			excludeExtraneousValues: true,
		// 		},
		// 	);
		// 	await this.redisService.set(
		// 		RedisKeyEnum.MenuKey,
		// 		JSON.stringify(menuList),
		// 	);
		// 	return menuList;
		// } catch (error) {
		// 	this.logger.error(error);
		// 	throw new BadRequestException("查找菜单失败");
		// }
	}

	/**
	 * 查询所有菜单id
	 * @returns
	 */
	async findAllIds() {
		// this.logger.log(`${this.findAllIds.name} was called`);
		// const menuList = await this.menuRepository.find({
		// 	select: {
		// 		id: true,
		// 	},
		// 	where: {
		// 		isDelete: false,
		// 	},
		// });
		// return menuList.map((item) => item.id);
	}

	/**
	 * 根据id查找菜单
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		// try {
		// 	if (!id) throw new BadRequestException("菜单不存在");
		// 	const menu = await this.menuRepository.findOne({
		// 		where: {
		// 			id,
		// 			isDelete: false,
		// 		},
		// 	});
		// 	if (!menu) throw new BadRequestException("菜单不存在");
		// 	return plainToInstance(ExportMenuDto, menu, {
		// 		excludeExtraneousValues: true,
		// 	});
		// } catch (error) {
		// 	this.logger.error(error);
		// 	if (error.message) throw new BadRequestException(error.message);
		// 	throw new BadRequestException("查找菜单失败");
		// }
	}

	/**
	 * 更新菜单
	 * @param id
	 * @param updateMenuDto
	 * @returns
	 */
	async update(id: number, updateMenuDto: UpdateMenuDto) {
		// this.logger.log(`${this.update.name} was called`);
		// this.judgeCanDo(id);
		// try {
		// 	await this.findOne(id);
		// 	await this.menuRepository.save({
		// 		id,
		// 		isDelete: false,
		// 		...updateMenuDto,
		// 	});
		// 	await this.redisService._delKeysWithPrefix(RedisKeyEnum.MenuKey);
		// 	await this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);
		// 	return "更新菜单成功";
		// } catch (error) {
		// 	this.logger.error(error);
		// 	if (
		// 		error instanceof QueryFailedError &&
		// 		error.driverError.errno == 1062
		// 	) {
		// 		throw new BadRequestException("菜单名已存在");
		// 	}
		// 	if (error.message) throw new BadRequestException(error.message);
		// 	throw new BadRequestException("更新菜单失败");
		// }
	}

	/**
	 * 删除菜单
	 * @param id
	 * @returns
	 */
	async remove(id: number) {
		// this.logger.log(`${this.remove.name} was called`);
		// this.judgeCanDo(id);
		// try {
		// 	const menu = await this.findOne(id);
		// 	await this.menuRepository.save({
		// 		id,
		// 		isDelete: true,
		// 		name: "已删除" + "_" + menu.name + "_" + UUID(),
		// 		roles: [],
		// 	});
		// 	await this.redisService._delKeysWithPrefix(RedisKeyEnum.MenuKey);
		// 	await this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);
		// 	return "删除菜单成功";
		// } catch (error) {
		// 	this.logger.error(error);
		// 	if (error.message) throw new BadRequestException(error.message);
		// 	throw new BadRequestException("删除菜单失败");
		// }
	}

	/**
	 * 根据id数组查找菜单
	 * @param ids
	 * @returns
	 */
	async findListByIds(ids: number[]) {
		// this.logger.log(`${this.findListByIds.name} was called`);
		// try {
		// 	return await this.menuRepository.find({
		// 		where: {
		// 			id: In(ids),
		// 			isDelete: false,
		// 		},
		// 	});
		// } catch (error) {
		// 	this.logger.error(error);
		// 	throw new BadRequestException("查找菜单失败");
		// }
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
