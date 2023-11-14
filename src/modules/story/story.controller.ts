/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 21:54:27
 * @FilePath: \cms\src\modules\story\story.controller.ts
 * @Description:
 */
import { RequirePermission } from "@/shared/decorators/require-permission.decorator";
import { PermissionEnum } from "@/shared/enums/permission.enum";
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
import { CreateStoryDto } from "./dto/create-story.dto";
import { QueryStoryDto } from "./dto/query-story.dto";
import { UpdateStoryDto } from "./dto/update-story.dto";
import { StoryService } from "./story.service";

@Controller("story")
@ApiTags("故事管理模块")
export class StoryController {
	constructor(private readonly storyService: StoryService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_STORY_CREATE)
	create(@Body() createStoryDto: CreateStoryDto) {
		return this.storyService.create(createStoryDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	@RequirePermission(PermissionEnum.SYSTEM_STORY_QUERY)
	findAll(@Body() queryStoryDto: QueryStoryDto) {
		return this.storyService.findAll(queryStoryDto);
	}

	@Get(":id")
	@RequirePermission(PermissionEnum.SYSTEM_STORY_QUERY)
	findOne(@Param("id") id: string) {
		return this.storyService.findOne(+id);
	}

	@Patch(":id")
	@RequirePermission(PermissionEnum.SYSTEM_STORY_UPDATE)
	update(@Param("id") id: string, @Body() updateStoryDto: UpdateStoryDto) {
		return this.storyService.update(+id, updateStoryDto);
	}

	@Delete(":id")
	@RequirePermission(PermissionEnum.SYSTEM_STORY_DELETE)
	remove(@Param("id") id: string) {
		return this.storyService.remove(+id);
	}
}
