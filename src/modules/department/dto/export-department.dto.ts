import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ExportDepartmentDto {
	@ApiProperty({ description: "部门id", example: 1, type: Number })
	@Expose()
	id: number;

	@ApiProperty({ description: "部门名称", example: "研发部", type: String })
	@Expose()
	name: string;

	@ApiProperty({ description: "父级id", example: 1, type: Number })
	@Expose()
	parentId: number;

	@ApiProperty({ description: "部门领导", example: "张三", type: String })
	@Expose()
	leader: string;

	@ApiProperty({
		description: "创建时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	updateAt: Date;
}
