/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:21:49
 * @FilePath: \cms\src\modules\roles\roles.service.ts
 * @Description:
 */
import { Role } from "@/shared/entities/role.entity";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { filterEmpty } from "@/shared/utils/filer-empty";
import { generateTree } from "@/shared/utils/generate-tree";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Between, In, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
import { ExportMenuDto } from "../menus/dto/export-menu.dto";
import { MenusService } from "../menus/menus.service";
import { AssignRoleDto } from "./dto/assign-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ExportRoleListDto } from "./dto/export-role-list.dto";
import { ExportRoleDto } from "./dto/export-role.dto";
import { QueryRoleDto } from "./dto/query-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
	constructor(
		private readonly logger: AppLoggerSevice,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		private readonly menusService: MenusService,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(RolesService.name);
	}

	/**
	 * 创建角色
	 * @param createRoleDto
	 * @returns
	 */
	async create(createRoleDto: CreateRoleDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			const { intro, menuList: menuListIds, name } = createRoleDto;

			//1.根据menuList查找菜单
			const menuList = await this.menusService.findListByIds(menuListIds);
			//2.创建角色
			const role = this.roleRepository.create({
				intro,
				name,
				menuList,
			});

			//3.保存角色
			await this.roleRepository.save(role);

			this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);
			return "创建角色成功";
		} catch (error) {
			//判断是否是重复键值
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("角色名已存在");
			}
			throw new BadRequestException("创建角色失败");
		}
	}

	/**
	 * 获取角色列表
	 * @param queryRoleDto
	 * @returns
	 */
	async findAll(queryRoleDto: QueryRoleDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const { offset, size, createAt, id, intro, menuList, name, updateAt } =
				queryRoleDto;

			const filterQueryRoleDto = filterEmpty(queryRoleDto);
			const redisRoleList = await this.redisService._get(
				RedisKeyEnum.RoleKey + JSON.stringify(filterQueryRoleDto),
			);
			if (redisRoleList) return redisRoleList;

			const [list, totalCount] = await this.roleRepository.findAndCount({
				where: {
					id,
					intro: intro && Like(`%${intro}%`),
					name: name && Like(`%${name}%`),
					menuList: {
						id: menuList && In(menuList),
					},
					createAt: createAt && Between(createAt[0], createAt[1]),
					updateAt: updateAt && Between(updateAt[0], updateAt[1]),
					isDelete: false,
				},
				relations: {
					menuList: true,
				},
				skip: offset,
				take: size,
				order: {
					id: "DESC",
				},
			});

			//如果是超级管理员
			const admin = list.find((role) => role.id == 1);
			if (admin) {
				admin.menuList = await this.menusService.findAll();
			}

			const roleList = plainToInstance(
				ExportRoleListDto,
				{
					list,
					totalCount,
				},
				{
					excludeExtraneousValues: true,
				},
			);
			//缓存
			this.redisService._set(
				RedisKeyEnum.RoleKey + JSON.stringify(filterQueryRoleDto),
				roleList,
			);
			return roleList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取角色列表失败");
		}
	}

	/**
	 * 根据id查找角色
	 * @param id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			if (!id) throw new BadRequestException("角色不存在");
			const role = await this.roleRepository.findOne({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!role) throw new BadRequestException("角色不存在");
			return plainToInstance(ExportRoleDto, role, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("查找角色失败");
		}
	}

	/**
	 * 根据id查找角色并携带菜单列表
	 * @param id
	 * @returns
	 */
	async findRoleWithMenuList(id: number) {
		this.logger.log(`${this.findRoleWithMenuList.name} was called`);
		try {
			const role = await this.roleRepository.findOne({
				where: {
					id,
					enable: true,
					isDelete: false,
				},
				relations: {
					menuList: true,
				},
			});
			if (!role) throw new BadRequestException("角色不存在");
			return role;
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("获取角色失败");
		}
	}

	/**
	 * 更新角色
	 * @param id
	 * @param updateRoleDto
	 * @returns
	 */
	async update(id: number, updateRoleDto: UpdateRoleDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);

		try {
			//1.判断角色是否存在
			await this.findOne(id);

			const { menuList: menuIdList, intro, name } = updateRoleDto;
			//2.判断是否有菜单
			let menuList = null;
			if (menuIdList?.length > 0) {
				//3. 根据菜单id查找菜单
				menuList = await this.menusService.findListByIds(
					updateRoleDto.menuList,
				);
			}

			//4.更新角色
			await this.roleRepository.save({
				...updateRoleDto,
				id,
				intro,
				name,
				menuList,
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);

			return "更新角色成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("角色名已存在");
			}
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("更新角色失败");
		}
	}

	/**
	 * 删除角色
	 * @param id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const role = await this.findOne(id);
			await this.roleRepository.save({
				id,
				isDelete: true,
				name: "已删除" + "_" + role.name + "_" + UUID(),
				menuList: [],
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);
			return "删除角色成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除角色失败");
		}
	}

	/**
	 * 根据id查找角色的菜单列表
	 * @param id
	 * @returns
	 */
	async findRoleMenuById(id: number) {
		this.logger.log(`${this.findRoleMenuById.name} was called`);
		try {
			if (id == 1) {
				return await this.menusService.findAll();
			}
			const role = await this.roleRepository.findOne({
				where: {
					id,
					isDelete: false,
				},
				relations: ["menuList"],
			});
			if (!role) throw new BadRequestException("角色不存在");
			return plainToInstance(ExportMenuDto, generateTree(role.menuList), {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("获取角色菜单列表失败");
		}
	}

	/**
	 * 根据id查找角色的菜单ids列表
	 * @param id
	 * @returns
	 */
	async findRoleMenuIdsById(id: number) {
		this.logger.log(`${this.findRoleMenuIdsById.name} was called`);

		try {
			const role = await this.roleRepository.findOne({
				select: {
					id: true,
					intro: true,
					name: true,
					menuList: {
						id: true,
					},
				},
				where: {
					id,
					isDelete: false,
				},
				relations: ["menuList"],
			});
			if (!role) throw new BadRequestException("角色不存在");
			let menuIds = role.menuList.map((menu) => menu.id);
			//如果是超级管理员
			if (id == 1) {
				menuIds = await this.menusService.findAllIds();
			}
			delete role.menuList;
			return {
				...role,
				menuIds,
			};
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("获取角色菜单ids失败");
		}
	}

	/**
	 * 分配权限
	 * @param assignRoleDto
	 * @returns
	 */
	async assignRole(assignRoleDto: AssignRoleDto) {
		this.logger.log(`${this.assignRole.name} was called`);
		try {
			const { roleId, menuList: ids } = assignRoleDto;
			//1.判断角色是否存在
			await this.findOne(roleId);

			//2.获取菜单列表
			const menuList = await this.menusService.findListByIds(ids);
			//3.更新角色
			await this.roleRepository.save({ id: roleId, menuList });
			this.redisService._delKeysWithPrefix(RedisKeyEnum.RoleKey);
			return "分配权限成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("分配权限失败");
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 * @returns
	 */
	judgeCanDo(id: number) {
		if (id <= 5) {
			throw new ForbiddenException("系统角色不能操作");
		}
	}
}
