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
	create(@Body() createStoryDto: CreateStoryDto) {
		return this.storyService.create(createStoryDto);
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	findAll(@Body() queryStoryDto: QueryStoryDto) {
		return this.storyService.findAll(queryStoryDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.storyService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateStoryDto: UpdateStoryDto) {
		return this.storyService.update(+id, updateStoryDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.storyService.remove(+id);
	}
}
