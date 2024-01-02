/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:56
 * @FilePath: \cms\src\modules\department\department.controller.ts
 * @Description:
 */
import { RequirePermission } from "@/shared/decorators";
import { PermissionEnum } from "@/shared/enums";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { QueryDepartmentDto } from "./dto/query-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller("department")
@ApiTags("部门管理模块")
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	/**
	 * 创建部门
	 * @param createDepartmentDto 创建信息
	 * @returns
	 */
	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_DEPARTMENT_CREATE)
	create(@Body() createDepartmentDto: CreateDepartmentDto) {
		return this.departmentService.create(createDepartmentDto);
	}

	/**
	 * 查询部门列表
	 * @param queryDepartmentDto 查询条件
	 * @returns
	 */
	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryDepartmentDto: QueryDepartmentDto) {
		return this.departmentService.findAll(queryDepartmentDto);
	}

	/**
	 * 查询部门
	 * @param id 部门id
	 * @returns
	 */
	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_DEPARTMENT_QUERY)
	findOne(@Param("id") id: string) {
		return this.departmentService.findOne(+id);
	}

	/**
	 * 更新部门
	 * @param id 部门id
	 * @param updateDepartmentDto 更新信息
	 * @returns
	 */
	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_DEPARTMENT_UPDATE)
	update(
		@Param("id") id: string,
		@Body() updateDepartmentDto: UpdateDepartmentDto,
	) {
		return this.departmentService.update(+id, updateDepartmentDto);
	}

	/**
	 * 删除部门
	 * @param id 部门id
	 * @returns
	 */
	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_DEPARTMENT_DELETE)
	remove(@Param("id") id: string) {
		return this.departmentService.remove(+id);
	}
}
