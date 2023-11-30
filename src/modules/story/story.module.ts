/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:50
 * @FilePath: \cms\src\modules\story\story.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";

@Module({
	imports: [],
	controllers: [StoryController],
	providers: [StoryService],
})
export class StoryModule {}
