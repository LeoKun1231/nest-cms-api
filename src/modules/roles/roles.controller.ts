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
import { CreateRoleDto } from "./dto/create-role.dto";
import { QueryRoleDto } from "./dto/query-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";

@Controller("role")
@ApiTags("角色管理模块")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryRoleDto: QueryRoleDto) {
		return this.rolesService.findAll(queryRoleDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.rolesService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.rolesService.remove(+id);
	}
}
