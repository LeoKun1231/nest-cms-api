import { ExportDepartmentDto } from "@/modules/department/dto/export-department.dto";
import { ExportRoleDto } from "@/modules/roles/dto/export-role.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { ExportUserDto } from "./export-user.dto";

export class ExportUserListDto {
	@ApiProperty({ description: "用户列表", example: [], type: [ExportUserDto] })
	@Expose()
	@Type(() => ExportUserListItem)
	list: ExportUserListItem[];

	@ApiProperty({ description: "用户总数", example: 1, type: Number })
	@Expose()
	totalCount: number;
}

class ExportUserListItem {
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
		example: "1",
		type: Number,
	})
	@Expose()
	enable: number;

	@ApiProperty({
		description: "用户创建时间",
		example: "2022-01-01 00:00:00",
		type: Date,
	})
	@Expose()
	createAt: Date;

	@ApiProperty({
		description: "用户最后更新时间",
		example: "2022-01-01T00:00:00",
		type: Date,
	})
	@Expose()
	updateAt: Date;

	@ApiProperty({
		description: "用户角色Id",
		example: 1,
		type: Number,
	})
	@Expose()
	@Type(() => ExportRoleDto)
	@Transform(({ obj }) => {
		return obj?.roles?.[0]?.id;
	})
	roleId: ExportRoleDto;

	@ApiProperty({
		description: "用户部门Id",
		example: 1,
		type: Number,
	})
	@Expose()
	@Type(() => ExportDepartmentDto)
	@Transform(({ obj }) => {
		return obj?.department?.id;
	})
	departmentId: ExportDepartmentDto;
}
