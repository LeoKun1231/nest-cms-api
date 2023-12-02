/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 19:12:21
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 10:58:12
 * @FilePath: \cms\src\modules\users\dtos\export-user.dto.ts
 * @Description:
 */
import { ExportDepartmentDto } from "@/modules/department/dto/export-department.dto";
import { ExportRoleDto } from "@/modules/roles/dto/export-role.dto";
import { formatTime } from "@/shared/utils";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
export class ExportUserDto {
	@ApiProperty({
		description: "用户ID",
		example: 1,
		type: Number,
	})
	@Expose()
	id: number;

	@ApiProperty({
		description: "用户名",
		example: "John Doe",
		type: String,
	})
	@Expose()
	name: string;

	@ApiProperty({
		description: "真实姓名",
		example: "John Smith",
		type: String,
	})
	@Expose()
	realname: string;

	@ApiProperty({
		description: "手机号码",
		example: "1234567890",
		type: Number,
	})
	@Expose()
	@Transform(({ value }) => value / 1)
	cellphone: number;

	@ApiProperty({
		description: "用户是否启用",
		example: 1,
		type: Number,
	})
	@Expose()
	@Type(() => Number)
	enable: number;

	@ApiProperty({
		description: "用户创建时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	createAt: Date;

	@ApiProperty({
		description: "用户最后更新时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	@Transform(({ value }) => formatTime(value))
	updateAt: Date;

	@ApiProperty({
		description: "用户角色",
		example: ExportRoleDto,
		type: ExportRoleDto,
	})
	@Expose()
	@Type(() => ExportRoleDto)
	role: ExportRoleDto;

	@ApiProperty({
		description: "用户部门",
		example: ExportDepartmentDto,
		type: ExportDepartmentDto,
	})
	@Expose()
	@Type(() => ExportDepartmentDto)
	department: ExportDepartmentDto;
}
