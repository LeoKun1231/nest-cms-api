/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 12:05:11
 * @FilePath: \cms\src\modules\department\dto\export-department-list.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExportDepartmentDto } from "./export-department.dto";

export class ExportDepartmentListDto {
	@ApiProperty({
		type: [ExportDepartmentDto],
		description: "部门列表",
		example: [],
	})
	@Expose()
	@Type(() => ExportDepartmentDto)
	list: ExportDepartmentDto[];

	@ApiProperty({ type: Number, description: "部门总数", example: 1 })
	@Expose()
	totalCount: number;
}
