/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:49
 * @FilePath: \cms\src\modules\menus\dto\update-menu.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateMenuDto } from "./create-menu.dto";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
