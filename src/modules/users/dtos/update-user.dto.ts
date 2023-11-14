/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 19:12:21
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:35:16
 * @FilePath: \cms\src\modules\users\dtos\update-user.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
