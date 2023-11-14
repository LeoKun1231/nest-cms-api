import { Role } from "@/shared/entities/role.entity";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Between, In, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
import { MenusService } from "../menus/menus.service";
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
			const role = await this.roleRepository.create({
				intro,
				name,
				menuList,
			});

			//3.保存角色
			await this.roleRepository.save(role);
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
			console.log(
				"🚀 ~ file: roles.service.ts:102 ~ RolesService ~ findAll ~ error:",
				error.message,
			);
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
			await this.roleRepository.update(
				{ id, isDelete: false },
				{
					intro,
					name,
					menuList,
				},
			);
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
			await this.roleRepository.update(
				{ id, isDelete: false },
				{
					isDelete: true,
					name: "已删除" + "_" + role.name + "_" + UUID(),
				},
			);
			return "删除角色成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除角色失败");
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
