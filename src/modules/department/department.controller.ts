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

	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createDepartmentDto: CreateDepartmentDto) {
		return this.departmentService.create(createDepartmentDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryDepartmentDto: QueryDepartmentDto) {
		return this.departmentService.findAll(queryDepartmentDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.departmentService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateDepartmentDto: UpdateDepartmentDto,
	) {
		return this.departmentService.update(+id, updateDepartmentDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.departmentService.remove(+id);
	}
}
