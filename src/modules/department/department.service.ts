/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:32:08
 * @FilePath: \cms\src\modules\department\department.service.ts
 * @Description:
 */
import { WrapperType } from "@/@types/typeorm";
import { CacheEvict, Cacheable } from "@/shared/decorators";
import { RedisKeyEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { PrismaService } from "@/shared/prisma";
import { getRandomId, handleError } from "@/shared/utils";
import {
	BadRequestException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
		private readonly prismaService: PrismaService,
	) {
		this.logger.setContext(DepartmentService.name);
	}

	/**
	 * 创建部门
	 * @param createDepartmentDto
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.DepartmentKey)
	async create(createDepartmentDto: CreateDepartmentDto) {
		this.logger.log(`${this.create.name} was called`);
		try {
			await this.prismaService.department.create({
				data: createDepartmentDto,
			});
			return "创建部门成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "创建部门失败",
				unique: "部门名称已存在",
				foreign: "父级部门不存在",
			});
		}
	}

	/**
	 * 获取部门列表
	 * @param basePaginationDto 分页信息
	 * @returns
	 */
	@Cacheable(RedisKeyEnum.DepartmentKey)
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

			return plainToInstance(
				ExportDepartmentListDto,
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
				common: "获取部门列表失败",
			});
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
			handleError(this.logger, error, {
				common: "获取部门失败",
			});
		}
	}

	/**
	 * 更新部门
	 * @param id 部门id
	 * @param updateDepartmentDto 部门信息
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.DepartmentKey, RedisKeyEnum.UserKey)
	async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
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
			return "更新部门成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "更新部门失败",
				unique: "部门名称已存在",
				foreign: "父级部门不存在",
			});
		}
	}

	/**
	 * 删除部门
	 * @param id 部门id
	 * @returns
	 */
	@CacheEvict(RedisKeyEnum.DepartmentKey, RedisKeyEnum.UserKey)
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
					user: {
						set: [],
					},
				},
			});
			return "删除部门成功~";
		} catch (error) {
			handleError(this.logger, error, {
				common: "删除部门失败",
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
			throw new BadRequestException("系统默认部门不可操作");
		}
	}
}
