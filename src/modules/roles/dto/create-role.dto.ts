import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
	@ApiProperty({ description: "角色名称", type: String, example: "管理员" })
	@IsString({ message: "角色名称必须是字符串" })
	@IsNotEmpty({ message: "角色名称不能为空" })
	@MaxLength(20, { message: "角色名称最大长度为20" })
	name: string;

	@ApiProperty({ description: "角色介绍", type: String, example: "管理员" })
	@IsString({ message: "角色介绍必须是字符串" })
	@IsNotEmpty({ message: "角色介绍不能为空" })
	intro: string;

	@ApiProperty({ description: "菜单列表", type: [Number], example: [1, 2, 3] })
	@IsNotEmpty({ message: "菜单列表不能为空" })
	@IsArray({ message: "菜单列表必须是数组" })
	menuList: number[];
}
