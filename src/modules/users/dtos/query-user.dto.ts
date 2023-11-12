import { ValidateStringNumber } from "@/shared/decorators/validate-string-number.decorator";
import { BaseQueryDto } from "@/shared/dtos/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryUserDto extends BaseQueryDto {
	@ApiProperty({
		name: "手机号",
		example: 12345678901,
		type: Number,
		description: "手机号",
	})
	@ValidateStringNumber({ message: "手机号必须是字符串或者数字" })
	@Type(() => String)
	@IsOptional()
	cellphone: string;

	@ApiProperty({ name: "用户名", example: "张三", type: String })
	@IsString({ message: "用户名必须是字符串" })
	@IsOptional()
	name: string;

	@ApiProperty({ name: "用户真实姓名", example: "张三", type: String })
	@IsString({ message: "用户真实姓名必须是字符串" })
	@IsOptional()
	realname: string;

	@ApiProperty({ name: "角色id", example: 1, type: Number })
	@IsInt({ message: "角色id必须是数字" })
	@IsOptional()
	roleId: number;

	@ApiProperty({ name: "部门id", example: 1, type: Number })
	@IsInt({ message: "部门id必须是数字" })
	@IsOptional()
	departmentId: number;
}
