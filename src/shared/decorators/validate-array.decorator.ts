/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-14 14:13:44
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:51:02
 * @FilePath: \cms\src\shared\decorators\validate-number-array.decorator.ts
 * @Description:
 */
import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";

/**
 * 验证数组是否为数字数组
 * @param name 字段名
 * @param length 数组长度
 */
export function ValidateArrary(name: string, length = 2) {
	return Transform(({ value, key }) => {
		//1.判断是否是数组
		if (!Array.isArray(value)) {
			throw new BadRequestException(`${name}必须是数组`);
		}
		//2.判断数组长度是否为length
		if (value.length === 0) return undefined;
		if (value.length > length) {
			throw new BadRequestException(`${name}数组长度必须小于${length + 1}`);
		}
		//3.判断数组元素是否为数字
		if (
			value.some((item) => {
				return typeof item !== "number" && typeof item !== "string";
			})
		) {
			throw new BadRequestException(`${name}数组元素必须为数字或字符串`);
		}
		return value;
	});
}
