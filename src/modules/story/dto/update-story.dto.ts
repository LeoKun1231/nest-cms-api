/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:45
 * @FilePath: \cms\src\modules\story\dto\update-story.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateStoryDto } from "./create-story.dto";

export class UpdateStoryDto extends PartialType(CreateStoryDto) {}
