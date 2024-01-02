/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 10:56:11
 * @FilePath: \cms\src\modules\department\dto\export-department.dto.ts
 * @Description:
 */
import { formatTime } from "@/shared/utils";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";

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

	@ApiProperty({ description: "是否启用", example: 10, type: Number })
	@Expose()
	@Type(() => Number)
	enable: number;

	@ApiProperty({
		description: "创建时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2021-07-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	updateAt: Date;
}
