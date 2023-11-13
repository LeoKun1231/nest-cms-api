import { Story } from "@/shared/entities/story.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";

@Module({
	imports: [TypeOrmModule.forFeature([Story])],
	controllers: [StoryController],
	providers: [StoryService],
})
export class StoryModule {}
