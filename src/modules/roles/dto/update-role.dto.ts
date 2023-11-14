/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:19
 * @FilePath: \cms\src\modules\roles\dto\update-role.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
