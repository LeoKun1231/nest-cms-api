/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-10 18:31:40
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-15 10:44:17
 * @FilePath: \cms\src\shared\decorators\validate-date.decorator.ts
 * @Description:
 */
import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";

/**
 * 验证日期
 * @returns
 */
export function ValidateDate() {
	return Transform(({ value, key }) => {
		if (!value) return undefined;
		//1.判断是否是数组
		if (!Array.isArray(value)) {
			throw new BadRequestException(`${key} 必须是数组`);
		}
		//2.判断数组长度是否为二
		if (value.length === 0) return undefined;
		if (value.length != 2) {
			throw new BadRequestException(`${key} 数组长度必须为二`);
		}
		//3.判断数组元素是否为日期
		if (
			value.some((item) => {
				return new Date(item).toString() === "Invalid Date";
			})
		) {
			throw new BadRequestException(`${key} 数组元素必须为日期`);
		}
		//4.返回日期
		//由于prisma的时间是UTC时间，所以需要减去8小时
		return [
			new Date(new Date(value[0]).getTime() - 8 * 60 * 60 * 1000),
			new Date(new Date(value[1]).getTime() - 8 * 60 * 60 * 1000),
		];
	});
}
