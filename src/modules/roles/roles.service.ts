/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:21:49
 * @FilePath: \cms\src\modules\roles\roles.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/wrapper";
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { generateTree, getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { Menu, Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { ExportMenuDto } from "../menus/dto/export-menu.dto";
import { MenusService } from "../menus/menus.service";
import { UsersService } from "../users/users.service";
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
		private readonly menusService: MenusService,
		private readonly prismaService: PrismaService,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: WrapperType<UsersService>,
	) {
		this.logger.setContext(RolesService.name);
	}

	/**
	 * 创建角色
	 * @param createRoleDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.RoleKey)
	async create(createRoleDto: CreateRoleDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			const { intro, menuList, name } = createRoleDto;

			//1.根据menuList查找菜单
			const menus = await this.menusService.findListByIds(menuList);
			//2.创建角色
			await this.prismaService.role.create({
				data: {
					intro,
					name,
					roleMenu: {
						createMany: {
							data: menus.map((menu) => ({ menuId: menu.id })),
						},
					},
				},
			});

			return "创建角色成功";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建角色失败",
				unique: "角色名已存在",
			});
		}
	}

	/**
	 * 获取角色列表
	 * @param queryRoleDto
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.RoleKey)
	async findAll(queryRoleDto: QueryRoleDto) {
		this.logger.log(`${this.findAll.name} was called`);

		try {
			const {
				offset,
				size,
				createAt,
				id,
				intro,
				menuList,
				name,
				updateAt,
				enable,
			} = queryRoleDto;

			const where: Prisma.RoleWhereInput = {
				id,
				intro: {
					contains: intro,
				},
				name: {
					contains: name,
				},
				roleMenu: {
					every: {
						menuId: {
							in: menuList,
						},
					},
				},
				createAt: {
					gte: createAt?.[0],
					lte: createAt?.[1],
				},
				updateAt: {
					gte: updateAt?.[0],
					lte: updateAt?.[1],
				},
				enable,
				isDelete: false,
			};

			const [roleList, totalCount] = await this.prismaService.$transaction([
				this.prismaService.role.findMany({
					include: {
						roleMenu: {
							select: {
								menu: true,
							},
						},
					},
					where,
					skip: offset,
					take: size,
					orderBy: {
						id: "desc",
					},
				}),
				this.prismaService.role.count({ where }),
			]);

			// // 如果是超级管理员;
			const admin = roleList.find((role) => role.id == 1);
			let adminList = [];
			if (admin) {
				adminList = await this.menusService.findAll();
			}

			const list = roleList.map((role) => {
				if (role.id === 1) {
					return {
						...role,
						menuList: adminList,
					};
				}
				return {
					...role,
					menuList: generateTree(
						role.roleMenu.map((menu) => ({ ...menu.menu })),
					),
				};
			});

			return plainToInstance(
				ExportRoleListDto,
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
				common: "获取角色列表失败",
			});
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
			const role = await this.prismaService.role.findUnique({
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
			handleError(this.logger, error, {
				common: "查找角色失败",
			});
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
			await this.findOne(id);
			const { roleMenu, ...rest } = await this.prismaService.role.findUnique({
				where: {
					id,
					enable: true,
					isDelete: false,
				},
				include: {
					roleMenu: {
						select: {
							menu: true,
						},
					},
				},
			});

			const menuList = roleMenu.map((menu) => ({ ...menu.menu }));

			if (!rest) throw new BadRequestException("角色不存在");
			return {
				...rest,
				menuList,
			};
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取角色菜单失败",
			});
		}
	}

	/**
	 * 更新角色
	 * @param id
	 * @param updateRoleDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.RoleKey, RedisKeyEnum.UserKey)
	async update(id: number, updateRoleDto: UpdateRoleDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			//1.判断角色是否存在
			await this.findOne(id);
			const { menuList: menuIdList, intro, name, enable } = updateRoleDto;

			const data: Prisma.RoleUpdateInput = {
				intro,
				name,
				enable,
			};

			//2.判断是否有菜单
			let menuList: Menu[] = null;
			if (menuIdList?.length > 0) {
				//根据菜单id查找菜单
				menuList = await this.menusService.findListByIds(menuIdList);

				//删除角色菜单关联关系 并且创建新的关联关系
				data.roleMenu = {
					deleteMany: {},
					createMany: {
						data: menuList.map((menu) => ({ menuId: menu.id })),
					},
				};
			}
			//4.更新角色
			await this.prismaService.role.update({
				where: {
					id,
					isDelete: false,
				},
				data,
			});
			if (updateRoleDto.enable != undefined) {
				await this.userService.changeUserEnable(
					id,
					"role",
					updateRoleDto.enable,
				);
			}
			return "更新角色成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新角色失败",
				unique: "角色名已存在",
			});
		}
	}

	/**
	 * 删除角色
	 * @param id
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.RoleKey, RedisKeyEnum.UserKey)
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const role = await this.findOne(id);
			await this.prismaService.role.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					isDelete: true,
					name: "已删除" + "_" + role.name + "_" + getRandomId(),
					roleMenu: {
						deleteMany: {},
					},
					userRole: {
						deleteMany: {},
					},
				},
			});
			return "删除角色成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除角色失败",
			});
		}
	}

	/**
	 * 根据id查找角色的菜单列表
	 * @param id
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.RoleKey, RedisKeyEnum.MenuKey)
	async findRoleMenuById(id: number) {
		this.logger.log(`${this.findRoleMenuById.name} was called`);
		try {
			if (id == 1) {
				return await this.menusService.findAll();
			}
			const role = await this.findRoleWithMenuList(id);
			if (!role) throw new BadRequestException("角色不存在");
			return plainToInstance(ExportMenuDto, generateTree(role.menuList), {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取角色菜单失败",
			});
		}
	}

	/**
	 * 根据id查找角色的菜单ids列表
	 * @param id
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.RoleKey, RedisKeyEnum.MenuKey)
	async findRoleMenuIdsById(id: number) {
		this.logger.log(`${this.findRoleMenuIdsById.name} was called`);
		try {
			const role = await this.prismaService.role.findUnique({
				select: {
					id: true,
					intro: true,
					name: true,
					roleMenu: {
						select: {
							menuId: true,
						},
					},
				},
				where: {
					id,
					isDelete: false,
				},
			});
			if (!role) throw new BadRequestException("角色不存在");
			let menuIds = role.roleMenu.map((menu) => menu.menuId);
			//如果是超级管理员
			if (id == 1) {
				menuIds = await this.menusService.findAllIds();
			}
			delete role.roleMenu;
			return {
				...role,
				menuIds,
			};
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取角色菜单ids失败",
			});
		}
	}

	/**
	 * 分配权限
	 * @param assignRoleDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.RoleKey)
	async assignRole(assignRoleDto: AssignRoleDto) {
		this.logger.log(`${this.assignRole.name} was called`);
		try {
			const { roleId, menuList: ids } = assignRoleDto;
			//1.判断角色是否存在
			await this.findOne(roleId);
			//2.获取菜单列表
			const menuList = await this.menusService.findListByIds(ids);
			//3.更新角色
			await this.prismaService.role.update({
				where: {
					id: roleId,
					isDelete: false,
				},
				data: {
					roleMenu: {
						deleteMany: {},
						createMany: {
							data: menuList.map((menu) => ({ menuId: menu.id })),
						},
					},
				},
			});
			return "分配权限成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "分配权限失败",
			});
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
