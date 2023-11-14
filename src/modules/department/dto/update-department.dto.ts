/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:48
 * @FilePath: \cms\src\modules\department\dto\update-department.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateDepartmentDto } from "./create-department.dto";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
