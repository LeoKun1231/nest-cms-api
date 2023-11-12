import { Module } from "@nestjs/common";
import { StoryService } from "./story.service";
import { StoryController } from "./story.controller";

@Module({
	controllers: [StoryController],
	providers: [StoryService],
})
export class StoryModule {}
