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
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { MenusService } from "./menus.service";

@Controller("menu")
@ApiTags("菜单管理模块")
export class MenusController {
	constructor(private readonly menusService: MenusService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createMenuDto: CreateMenuDto) {
		return this.menusService.create(createMenuDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll() {
		return this.menusService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.menusService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateMenuDto: UpdateMenuDto) {
		return this.menusService.update(+id, updateMenuDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.menusService.remove(+id);
	}
}
