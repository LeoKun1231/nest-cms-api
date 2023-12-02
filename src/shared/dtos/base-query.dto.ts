/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 22:01:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 11:20:49
 * @FilePath: \cms\src\shared\dtos\base-query.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { TransformNumber2Boolean } from "../decorators/transform-number-to-boolean";
import { ValidateDate } from "../decorators/validate-date.decorator";
import { ValidateStringNumber } from "../decorators/validate-string-number.decorator";
import { BasePaginationDto } from "./base-pagination.dto";

export class BaseQueryDto extends BasePaginationDto {
	@ApiProperty({ name: "id", example: 1, type: Number })
	@ValidateStringNumber({ message: "id必须是字符串或者数字" })
	@Type(() => Number)
	@IsOptional()
	id: number;

	@ApiProperty({
		name: "是否启用 ",
		example: 0,
		type: Boolean,
		description: "0:禁用 1:启用",
	})
	@TransformNumber2Boolean()
	@IsOptional()
	enable: boolean;

	@ApiProperty({ name: "创建时间", example: "2021-10-10", type: [Date, Date] })
	@IsOptional()
	@ValidateDate()
	createAt: Array<Date>;

	@ApiProperty({ name: "更新时间", example: "2021-10-10", type: [Date, Date] })
	@ValidateDate()
	@IsOptional()
	updateAt: Array<Date>;
}
