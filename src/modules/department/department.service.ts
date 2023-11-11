import { Department } from "@/shared/entities/department.entity";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Between, Like, QueryFailedError, Repository } from "typeorm";
import { v4 as UUID } from "uuid";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { ExportDepartmentListDto } from "./dto/export-department-list.dto";
import { ExportDepartmentDto } from "./dto/export-department.dto";
import { QueryDepartmentDto } from "./dto/query-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentService {
	constructor(
		private readonly logger: AppLoggerSevice,
		@InjectRepository(Department)
		private readonly departmentRepository: Repository<Department>,
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
			await this.departmentRepository.save(createDepartmentDto);
			return "创建部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("部门名称已存在");
			} else if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1452
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

			const [list, totalCount] = await this.departmentRepository.findAndCount({
				where: {
					id,
					enable: enable && !!enable,
					name: name && Like(`%${name}%`),
					leader: leader && Like(`%${leader}%`),
					parentId,
					createAt: createAt && Between(createAt[0], createAt[1]),
					updateAt: updateAt && Between(updateAt[0], updateAt[1]),
					isDelete: false,
				},
				skip: offset,
				take: size,
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
			const department = await this.departmentRepository.findOne({
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

		try {
			await this.departmentRepository.update(
				{ id, isDelete: false },
				updateDepartmentDto,
			);
			return "更新部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1062
			) {
				throw new BadRequestException("部门名称已存在");
			} else if (
				error instanceof QueryFailedError &&
				error.driverError.errno == 1452
			) {
				throw new BadRequestException("父级部门不存在");
			}
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
		try {
			const department = await this.findOne(id);
			await this.departmentRepository.update(
				{ isDelete: false, id },
				{
					isDelete: true,
					name: "已删除" + "_" + department.name + "_" + UUID(),
				},
			);
			return "删除部门成功~";
		} catch (error) {
			this.logger.error(error);
			if (error.message) throw new BadRequestException(error.message);
			throw new BadRequestException("删除部门失败");
		}
	}
}
