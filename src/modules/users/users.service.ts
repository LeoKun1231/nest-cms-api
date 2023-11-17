/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-21 20:34:57
 * @FilePath: \cms\src\modules\users\users.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
import { Department } from "@/shared/entities/department.entity";
import { Role } from "@/shared/entities/role.entity";
import { User } from "@/shared/entities/user.entity";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { filterEmpty } from "@/shared/utils/filer-empty";
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
	forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compare, hash } from "bcrypt";
import { plainToClass, plainToInstance } from "class-transformer";
import { Between, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
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
		@InjectRepository(User)
		private readonly usersRespository: Repository<User>,
		@Inject(forwardRef(() => RolesService))
		private readonly rolseService: WrapperType<RolesService>,
		private readonly departmentService: DepartmentService,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(UsersService.name);
	}

	/**
	 * 验证用户
	 * @param name 用户名
	 * @param password 密码
	 * @returns
	 */
	async validateUser(name: string, password: string): Promise<User> {
		this.logger.log(`${this.validateUser.name} was called`);
		//查找用户
		const user = await this.usersRespository.findOne({
			where: { name, isDelete: false },
			relations: {
				roles: true,
				department: true,
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

		return plainToClass(User, user);
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

			const [role, department] = await Promise.all([
				this.rolseService.findOne(roleId),
				this.departmentService.findOne(departmentId),
			]);

			await this.usersRespository.save({
				name,
				password: hashPassword,
				realname,
				cellphone,
				roles: [plainToInstance(Role, role)],
				department: plainToInstance(Department, department),
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "创建用户成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("该用户名已存在");
			}
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("创建用户失败");
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
			const { departmentId, password, roleId, cellphone } = updateUserDto;
			const user = this.usersRespository.create({
				...updateUserDto,
				id,
				cellphone,
			});
			if (password) {
				const hashPassword = await hash(password, 10);
				user.password = hashPassword;
			}
			if (roleId) {
				const role = await this.rolseService.findOne(roleId);
				user.roles = [plainToInstance(Role, role)];
			}
			if (departmentId) {
				const department = await this.departmentService.findOne(departmentId);
				user.department = plainToInstance(Department, department);
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

			await this.usersRespository.save({
				...user,
				id,
				isDelete: false,
			});
			if (user.enable == false) {
				//禁用用户
				await this.redisService._delKeysWithPrefix(RedisKeyEnum.LoginKey + id);
			}
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);

			return "更新用户成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("该用户名已存在");
			}
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("更新用户失败");
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
			if (!id) throw new BadRequestException("该用户不存在");
			const user = await this.usersRespository.findOne({
				where: { id, isDelete: false },
				relations: {
					roles: true,
					department: true,
				},
			});
			if (!user) throw new BadRequestException("该用户不存在");
			return plainToInstance(ExportUserDto, user, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("查找用户失败");
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

			const [list, totalCount] = await this.usersRespository.findAndCount({
				select: {
					roles: {
						id: true,
					},
					department: {
						id: true,
					},
				},
				where: {
					id,
					cellphone: cellphone && Like(`%${cellphone}%`),
					createAt: createAt && Between(createAt[0], createAt[1]),
					name: name && Like(`%${name}%`),
					realname: realname && Like(`%${realname}%`),
					updateAt: updateAt && Between(updateAt[0], updateAt[1]),
					enable: enable && !!enable,
					roles: roleId && { id: roleId },
					department: departmentId && { id: departmentId },
					isDelete: false,
				},
				take: size,
				skip: offset,
				relations: {
					roles: true,
					department: true,
				},
				order: {
					id: "DESC",
				},
			});

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
			this.logger.error(error);
			throw new BadRequestException("查找用户列表失败");
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
			await this.usersRespository.update(
				{ id, isDelete: false },
				{
					isDelete: true,
					name: "已删除" + "_" + user.name + "_" + UUID(),
				},
			);
			this.redisService.del(RedisKeyEnum.LoginKey + id);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "删除用户成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除用户失败");
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
				const users = await this.usersRespository.find({
					where: {
						roles: {
							id,
							isDelete: false,
						},
					},
				});
				users.forEach((role) => {
					role.enable = false;
				});
				await this.usersRespository.save(users);
			} else if (type == "department") {
				const users = await this.usersRespository.find({
					where: {
						department: {
							id,
							isDelete: false,
						},
					},
				});
				users.forEach((user) => {
					user.enable = false;
				});
				await this.usersRespository.save(users);
			}
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("禁用用户失败");
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
