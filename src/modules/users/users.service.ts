/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-21 20:34:57
 * @FilePath: \cms\src\modules\users\users.service.ts
 * @Description:
 */
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { RedisService } from "@/shared/redis";
import { filterEmpty, getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
	forwardRef,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { plainToInstance } from "class-transformer";
import { DepartmentService } from "../department/department.service";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ExportUserListDto } from "./dtos/export-user-list.dto";
import { ExportUserDto } from "./dtos/export-user.dto";
import { QueryUserDto } from "./dtos/query-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		@Inject(forwardRef(() => RolesService))
		private readonly rolseService: RolesService,
		private readonly departmentService: DepartmentService,
	) {
		this.logger.setContext(UsersService.name);
	}

	/**
	 * 验证用户
	 * @param name 用户名
	 * @param password 密码
	 * @returns
	 */
	async validateUser(name: string, password: string) {
		this.logger.log(`${this.validateUser.name} was called`);
		try {
			//查找用户
			const user = await this.prismaService.user.findUnique({
				select: {
					id: true,
					name: true,
					password: true,
					enable: true,
					roles: true,
				},
				where: {
					name,
					isDelete: false,
				},
			});
			//判断用户是否存在
			if (!user) throw new UnauthorizedException("用户不存在");
			//判断密码是否正确
			const isPasswordValid = await compare(password, user.password);
			//密码不正确
			if (!isPasswordValid) throw new UnauthorizedException("账号或密码错误");
			//判断用户是否被禁用
			if (!user.enable) throw new UnauthorizedException("用户被禁用");
			return user;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("验证用户失败");
		}
	}

	/**
	 * 创建用户
	 * @param name 用户名
	 * @param password 密码
	 * @returns
	 */
	async createUser(createUserDto: CreateUserDto) {
		this.logger.log(`${this.createUser.name} was called`);
		try {
			const { name, password, cellphone, departmentId, realname, roleId } =
				createUserDto;
			const hashPassword = await hash(password, 10);
			//判断角色、部门是否存在
			await Promise.all([
				this.rolseService.findOne(roleId),
				this.departmentService.findOne(departmentId),
			]);
			await this.prismaService.user.create({
				data: {
					name,
					password: hashPassword,
					realname,
					cellphone,
					roles: {
						connect: [
							{
								userId_roleId: {
									roleId,
									userId: undefined,
								},
							},
						],
					},
					departmentId,
				},
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "创建用户成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建用户失败",
				unique: "用户名已存在",
			});
		}
	}

	/**
	 * 更新用户
	 * @param id 用户id
	 * @param updateUserDto 更新信息
	 * @returns
	 */
	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		this.logger.log(`${this.updateUser.name} was called`);
		this.judgeCanDo(id);
		try {
			//判断用户是否存在
			const findUser = await this.findUserById(id);
			const { departmentId, password, roleId } = updateUserDto;

			const user: Prisma.UserUpdateInput = Object.assign(
				findUser,
				updateUserDto,
			);

			if (password) {
				const hashPassword = await hash(updateUserDto.password, 10);
				user.password = hashPassword;
			}
			if (roleId) {
				//判断角色是否存在
				await this.rolseService.findOne(roleId);
				user.roles = {
					connect: {
						userId_roleId: {
							roleId,
							userId: id,
						},
					},
				};
			}
			if (departmentId) {
				//判断部门是否存在
				await this.departmentService.findOne(departmentId);
				user.department = {
					connect: {
						id: departmentId,
					},
				};
			}

			//启用用户之前 先判断角色或者部门是否被禁用
			if (user.enable == true) {
				const [role, department] = await Promise.all([
					this.rolseService.findOne(findUser.role.id),
					this.departmentService.findOne(findUser.department.id),
				]);
				//判断角色或者部门是否被禁用
				if (role.enable == 0) {
					throw new BadRequestException("该用户角色已被禁用");
				}
				if (department.enable == 0) {
					throw new BadRequestException("该用户部门已被禁用");
				}
			}
			await this.prismaService.user.update({
				where: {
					id,
					isDelete: false,
				},
				data: {
					...user,
				},
			});
			if (user.enable == false) {
				//禁用用户
				await this.redisService._delKeysWithPrefix(RedisKeyEnum.LoginKey + id);
			}
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "更新用户成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新用户失败",
				unique: "用户名已存在",
			});
		}
	}

	/**
	 * 根据id查找用户
	 * @param id 用户id
	 * @returns
	 */
	async findUserById(id: number) {
		this.logger.log(`${this.findUserById.name} was called`);
		try {
			const user = await this.prismaService.user.findUnique({
				where: {
					id,
					isDelete: false,
				},
				include: {
					department: true,
					roles: {
						select: {
							role: true,
						},
					},
				},
			});
			if (!user) throw new BadRequestException("该用户不存在");
			return plainToInstance(ExportUserDto, user, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			handleError(this.logger, error, {
				common: "查找用户失败",
			});
		}
	}

	/**
	 * 获取用户列表
	 * @param queryUserDto 查询条件
	 * @returns
	 */
	async findAll(queryUserDto: QueryUserDto) {
		this.logger.log(`${this.findAll.name} was called`);
		const {
			cellphone,
			createAt,
			departmentId,
			enable,
			id,
			name,
			offset,
			realname,
			roleId,
			size,
			updateAt,
		} = queryUserDto;
		try {
			const filterQueryUserDto = filterEmpty(queryUserDto);
			const redisUserList = await this.redisService._get(
				RedisKeyEnum.UserKey + JSON.stringify(filterQueryUserDto),
			);
			if (redisUserList) return redisUserList;

			const where: Prisma.UserWhereInput = {
				id,
				cellphone: {
					contains: cellphone,
				},
				name: {
					contains: name,
				},
				realname: {
					contains: realname,
				},
				createAt: {
					in: createAt,
				},
				updateAt: {
					in: updateAt,
				},
				enable: enable && !!enable,
				roles: {
					every: {
						roleId: {
							equals: roleId,
						},
					},
				},
				departmentId,
				isDelete: false,
			};

			const [list, totalCount] = await this.prismaService.$transaction([
				this.prismaService.user.findMany({
					where,
					take: size,
					skip: offset,
					orderBy: {
						id: "desc",
					},
					include: {
						roles: {
							select: {
								role: true,
							},
						},
						department: true,
					},
				}),
				this.prismaService.user.count({ where }),
			]);

			const userList = plainToInstance(
				ExportUserListDto,
				{ list, totalCount },
				{
					excludeExtraneousValues: true,
				},
			);
			this.redisService._set(
				RedisKeyEnum.UserKey + JSON.stringify(filterQueryUserDto),
				userList,
			);
			return userList;
		} catch (error) {
			handleError(this.logger, error, {
				common: "获取用户列表失败",
			});
		}
	}

	/**
	 * 删除用户
	 * @param id 用户id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const user = await this.findUserById(id);
			await this.prismaService.user.update({
				where: { id, isDelete: false },
				data: {
					isDelete: true,
					name: "已删除" + "_" + user.name + "_" + getRandomId(),
				},
			});
			this.redisService.del(RedisKeyEnum.LoginKey + id);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "删除用户成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除用户失败",
			});
		}
	}

	/**
	 * 禁用用户
	 * @param id 禁用类id
	 * @type "role" | "department"
	 * @returns
	 */
	async disabledUser(id: number, type: "role" | "department") {
		this.logger.log(`${this.disabledUser.name} was called`);
		try {
			if (type == "role") {
				await this.prismaService.user.updateMany({
					where: {
						roles: {
							every: {
								roleId: id,
							},
						},
					},
					data: {
						enable: false,
					},
				});
			} else if (type == "department") {
				await this.prismaService.user.updateMany({
					where: {
						departmentId: id,
					},
					data: {
						enable: false,
					},
				});
			}
		} catch (error) {
			handleError(this.logger, error, {
				common: "禁用用户失败",
			});
		}
	}

	/**
	 * 记录用户ip
	 * @param id 用户id
	 * @param ip 用户ip
	 * @returns
	 */
	async recordUserIp(id: number, ip: string) {
		this.logger.log(`${this.recordUserIp.name} was called`);
		try {
			await this.prismaService.user.update({
				where: { id },
				data: { ip },
			});
		} catch (error) {
			handleError(this.logger, error, { common: "记录用户ip失败" });
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 * @returns
	 */
	judgeCanDo(id: number) {
		if (id <= 6) {
			throw new ForbiddenException("系统用户不能操作");
		}
	}
}
