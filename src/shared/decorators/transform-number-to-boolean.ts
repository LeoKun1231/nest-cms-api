/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-05 19:37:54
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:35:48
 * @FilePath: \cms\src\shared\decorators\expose-not-null.decorator.ts
 * @Description:
 */
import { BadRequestException, applyDecorators } from "@nestjs/common";
import { Transform, Type } from "class-transformer";

/**
 * @description: 将字符串/数字转换为布尔值除了undefined和null
 * @param {*}
 * @return {*}
 */
export function TransformNumber2Boolean() {
	return applyDecorators(
		Type(() => Number),
		Transform(({ value, key }) => {
			if (value === undefined || value === null) return undefined;
			if (typeof value !== "number" && typeof value != "string") {
				throw new BadRequestException(`${key}必须是数字或者字符串`);
			}
			return !!value;
		}),
	);
}
