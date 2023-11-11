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
