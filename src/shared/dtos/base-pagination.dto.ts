/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-08 19:56:10
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:51:12
 * @FilePath: \cms\src\shared\dtos\base-pagination.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class BasePaginationDto {
	@ApiProperty({ type: Number, example: 10 })
	@IsInt({ message: "size必须是整数" })
	@IsNotEmpty({ message: "size不能为空" })
	size: number;

	@ApiProperty({ type: Number, example: 0 })
	@IsInt({ message: "offset必须是整数" })
	@IsNotEmpty({ message: "offset不能为空" })
	offset: number;
}
