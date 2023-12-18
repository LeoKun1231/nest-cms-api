/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-21 20:34:57
 * @FilePath: \cms\src\modules\users\users.service.ts
 * @Description:
 */
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { RedisService } from "@/shared/redis";
import { getRandomId, handleError } from "@/shared/utils";
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

const images = [
	"https://p9-passport.byteacctimg.com/img/mosaic-legacy/3792/5112637127~40x40.awebp",
	"https://p3-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~50x50.awebp",
	"https://p26-passport.byteacctimg.com/img/mosaic-legacy/3795/3044413937~50x50.awebp",
	"https://p26-passport.byteacctimg.com/img/mosaic-legacy/3795/3044413937~50x50.awebp",
];

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
					userRole: true,
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
	@CacheEvict(RedisKeyEnum.UserKey)
	async createUser(createUserDto: CreateUserDto) {
		this.logger.log(`${this.createUser.name} was called`);
		try {
			const { name, password, cellphone, departmentId, realname, roleId } =
				createUserDto;
			let { avatar } = createUserDto;
			const hashPassword = await hash(password, 10);
			//判断角色、部门是否存在
			await Promise.all([
				this.rolseService.findOne(roleId),
				this.departmentService.findOne(departmentId),
			]);

			if (!avatar) {
				//随机获取头像
				avatar = images[Math.floor(Math.random() * 4)];
			}
			await this.prismaService.user.create({
				data: {
					name,
					password: hashPassword,
					realname,
					cellphone,
					avatar,
					userRole: {
						create: {
							roleId,
						},
					},
					departmentId,
				},
			});
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
	@CacheEvict(RedisKeyEnum.UserKey)
	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		this.logger.log(`${this.updateUser.name} was called`);
		this.judgeCanDo(id);
		try {
			//判断用户是否存在
			const findUser = await this.findUserById(id);
			const {
				departmentId,
				password,
				roleId,
				enable,
				cellphone,
				name,
				realname,
				avatar,
			} = updateUserDto;

			const user: Prisma.UserUpdateInput = {
				enable,
				cellphone,
				name,
				realname,
				avatar,
			};

			//判断密码是否存在
			if (password) {
				const hashPassword = await hash(updateUserDto.password, 10);
				user.password = hashPassword;
			}
			//判断角色是否存在
			if (roleId) {
				await this.rolseService.findOne(roleId);
				user.userRole = {
					deleteMany: {},
					create: {
						roleId,
					},
				};
			}
			//判断部门是否存在
			if (departmentId) {
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

			//禁用用户之前 先删除用户登录信息
			if (user.enable == false) {
				//禁用用户
				await this.redisService._delKeysWithPrefix(RedisKeyEnum.LoginKey + id);
			}
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
					userRole: {
						select: {
							role: true,
						},
					},
				},
			});
			if (!user) throw new BadRequestException("该用户不存在");
			return plainToInstance(
				ExportUserDto,
				{
					...user,
					role: user.userRole[0].role,
				},
				{
					excludeExtraneousValues: true,
				},
			);
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
	@Cacheable(RedisKeyEnum.UserKey)
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
					gte: createAt?.[0],
					lte: createAt?.[1],
				},
				updateAt: {
					gte: updateAt?.[0],
					lte: updateAt?.[1],
				},
				enable: enable && !!enable,
				userRole: {
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
						userRole: {
							select: {
								role: true,
							},
						},
						department: true,
					},
				}),
				this.prismaService.user.count({ where }),
			]);
			return plainToInstance(
				ExportUserListDto,
				{ list, totalCount },
				{
					excludeExtraneousValues: true,
				},
			);
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
	@CacheEvict(RedisKeyEnum.UserKey)
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
					userRole: {
						deleteMany: {},
					},
				},
			});
			this.redisService.del(RedisKeyEnum.LoginKey + id);
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

	async changeUserEnable(
		id: number,
		type: "role" | "department",
		enable: boolean,
	) {
		this.logger.log(`${this.changeUserEnable.name} was called`);
		try {
			if (type == "role") {
				await this.prismaService.user.updateMany({
					where: {
						userRole: {
							every: {
								roleId: id,
							},
						},
						enable: !enable,
					},
					data: {
						enable,
					},
				});
			} else if (type == "department") {
				await this.prismaService.user.updateMany({
					where: {
						departmentId: id,
						enable: !enable,
					},
					data: {
						enable,
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
