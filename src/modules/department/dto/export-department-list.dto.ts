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

	@Expose()
	@ApiProperty({ type: Number, description: "部门总数", example: 1 })
	totalCount: number;
}
