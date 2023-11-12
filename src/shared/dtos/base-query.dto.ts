import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
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
	@IsInt({ message: "是否启用必须是数字" })
	@IsOptional()
	enable: number;

	@ApiProperty({ name: "创建时间", example: "2021-10-10", type: [Date, Date] })
	@IsOptional()
	@ValidateDate()
	createAt: Array<Date>;

	@ApiProperty({ name: "更新时间", example: "2021-10-10", type: [Date, Date] })
	@ValidateDate()
	@IsOptional()
	updateAt: Array<Date>;
}
