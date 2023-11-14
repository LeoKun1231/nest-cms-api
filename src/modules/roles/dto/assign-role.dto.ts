import { ValidateStringNumber } from "@/shared/decorators/validate-string-number.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty } from "class-validator";

export class AssignRoleDto {
	@ApiProperty({
		name: "角色id",
		type: String,
		example: "1",
	})
	@ValidateStringNumber()
	@IsNotEmpty({ message: "角色id不能为空" })
	@Type(() => Number)
	roleId: number;

	@ApiProperty({
		name: "菜单列表ids",
		type: [Number],
		example: [1, 2, 3],
	})
	@IsArray({ message: "菜单列表ids必须是数组" })
	@IsNotEmpty({ message: "菜单列表ids不能为空" })
	menuList: number[];
}
