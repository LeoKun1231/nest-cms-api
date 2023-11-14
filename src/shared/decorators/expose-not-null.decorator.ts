/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-05 19:37:54
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:35:48
 * @FilePath: \cms\src\shared\decorators\expose-not-null.decorator.ts
 * @Description:
 */
import { applyDecorators } from "@nestjs/common";
import { Expose, Transform } from "class-transformer";

/**
 * @description: 暴露并且排除null值
 * @param {*}
 * @return {*}
 */
export function ExposeNotNull() {
	return applyDecorators(
		Expose(),
		Transform(({ value }) => {
			if (value instanceof Array) {
				//判断是否为数组
				return value[0] && value;
			} else if (value instanceof Object) {
				//判断是否为对象
				return Object.keys(value).length > 0 && value;
			} else {
				if (!value) return;
				return value;
			}
		}),
	);
}
