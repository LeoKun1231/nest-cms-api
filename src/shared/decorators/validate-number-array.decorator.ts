import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";

/**
 * 验证数组是否为数字数组
 * @param name 字段名
 * @param length 数组长度
 */
export function ValidateNumberArrary(name: string, length = 2) {
	return Transform(({ value, key }) => {
		//1.判断是否是数组
		if (!Array.isArray(value)) {
			throw new BadRequestException(`${name}必须是数组`);
		}
		//2.判断数组长度是否为length
		if (value.length === 0) return undefined;
		if (value.length != length) {
			throw new BadRequestException(`${name}数组长度必须为${length}`);
		}
		//3.判断数组元素是否为数字
		if (
			value.some((item) => {
				return typeof item !== "number";
			})
		) {
			throw new BadRequestException(`${name}数组元素必须为数字`);
		}
		return value;
	});
}
