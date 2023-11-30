/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:08
 * @FilePath: \cms\src\modules\department\department.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
import { PrismaErrorCode, RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { RedisService } from "@/shared/redis";
import { filterEmpty, getRandomId } from "@/shared/utils";
import {
	BadRequestException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { plainToInstance } from "class-transformer";
import { UsersService } from "../users/users.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { ExportDepartmentListDto } from "./dto/export-department-list.dto";
import { ExportDepartmentDto } from "./dto/export-department.dto";
import { QueryDepartmentDto } from "./dto/query-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentService {
	constructor(
		private readonly logger: AppLoggerSevice,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: WrapperType<UsersService>,
		private readonly redisService: RedisService,
		private readonly prismaService: PrismaService,
	) {
		this.logger.setContext(DepartmentService.name);
	}

	/**
	 * 创建部门
	 * @param createDepartmentDto
	 * @returns
	 */
	async create(createDepartmentDto: CreateDepartmentDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			await this.prismaService.department.create({
				data: createDepartmentDto,
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.DepartmentKey);
			return "创建部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code == PrismaErrorCode.UniqueConstraintViolation
			) {
				throw new BadRequestException("部门名称已存在");
			} else if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code == PrismaErrorCode.ForeignKeyConstraintViolation
			) {
				throw new BadRequestException("父级部门不存在");
			}
			throw new BadRequestException("创建部门失败");
		}
	}

	/**
	 * 获取部门列表
	 * @param basePaginationDto 分页信息
	 * @returns
	 */
	async findAll(queryDepartmentDto: QueryDepartmentDto) {
		this.logger.log(`${this.findAll.name} was called`);
		try {
			const {
				offset,
				size,
				id,
				createAt,
				leader,
				name,
				parentId,
				enable,
				updateAt,
			} = queryDepartmentDto;

			const filterQueryDepartmentDto = filterEmpty(queryDepartmentDto);
			const redisDepartmentList = await this.redisService._get(
				RedisKeyEnum.DepartmentKey + JSON.stringify(filterQueryDepartmentDto),
			);
			if (redisDepartmentList) return redisDepartmentList;

			const where: Prisma.DepartmentWhereInput = {
				id,
				enable: enable && !!enable,
				name: {
					contains: name,
				},
				leader: {
					contains: leader,
				},
				parentId,
				createAt: {
					in: createAt,
				},
				updateAt: {
					in: updateAt,
				},
				isDelete: false,
			};

			const list = await this.prismaService.department.findMany({
				where,
				skip: offset,
				take: size,
				orderBy: {
					id: "desc",
				},
			});
			const totalCount = await this.prismaService.department.count({
				where,
			});

			const departmentList = plainToInstance(
				ExportDepartmentListDto,
				{
					list,
					totalCount,
				},
				{
					excludeExtraneousValues: true,
				},
			);
			this.redisService._set(
				RedisKeyEnum.DepartmentKey + JSON.stringify(filterQueryDepartmentDto),
				departmentList,
			);
			return departmentList;
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取部门列表失败");
		}
	}

	/**
	 * 获取部门
	 * @param id 部门id
	 * @returns
	 */
	async findOne(id: number) {
		this.logger.log(`${this.findOne.name} was called`);
		try {
			const department = await this.prismaService.department.findUnique({
				where: {
					id,
					isDelete: false,
				},
			});
			if (!department) throw new BadRequestException("部门不存在");
			return plainToInstance(ExportDepartmentDto, department, {
				excludeExtraneousValues: true,
			});
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("获取部门失败");
		}
	}

	/**
	 * 更新部门
	 * @param id 部门id
	 * @param updateDepartmentDto 部门信息
	 * @returns
	 */
	async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
		this.logger.log(`${this.update.name} was called`);
		this.judgeCanDo(id);
		try {
			await this.findOne(id);
			await this.prismaService.department.update({
				where: {
					id,
					isDelete: false,
				},
				data: updateDepartmentDto,
			});
			if (updateDepartmentDto.enable === false) {
				// 禁用部门下的所有用户
				await this.userService.disabledUser(id, "department");
			}
			this.redisService._delKeysWithPrefix(RedisKeyEnum.DepartmentKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "更新部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code == PrismaErrorCode.UniqueConstraintViolation
			) {
				throw new BadRequestException("部门名称已存在");
			} else if (
				error instanceof PrismaClientKnownRequestError &&
				error.code == PrismaErrorCode.ForeignKeyConstraintViolation
			) {
				throw new BadRequestException("父级部门不存在");
			}
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("更新部门失败");
		}
	}

	/**
	 * 删除部门
	 * @param id 部门id
	 * @returns
	 */
	async remove(id: number) {
		this.logger.log(`${this.remove.name} was called`);
		this.judgeCanDo(id);
		try {
			const department = await this.findOne(id);
			await this.prismaService.department.update({
				where: { isDelete: false, id },
				data: {
					isDelete: true,
					name: "已删除" + "_" + department.name + "_" + getRandomId(),
				},
			});
			this.redisService._delKeysWithPrefix(RedisKeyEnum.DepartmentKey);
			this.redisService._delKeysWithPrefix(RedisKeyEnum.UserKey);
			return "删除部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除部门失败");
		}
	}

	/**
	 * 判断是否可以操作
	 * @param id
	 * @returns
	 */
	judgeCanDo(id: number) {
		if (id <= 5) {
			throw new BadRequestException("系统默认部门不可操作");
		}
	}
}
