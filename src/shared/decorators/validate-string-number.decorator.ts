/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 16:02:53
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:51:06
 * @FilePath: \cms\src\shared\decorators\validate-string-number.decorator.ts
 * @Description:
 */
import { ValidationOptions, registerDecorator } from "class-validator";

/**
 * @description: 验证是否是字符串或者数字
 * @param {string} property
 * @param {ValidationOptions} validationOptions
 * @return {*}
 */
export function ValidateStringNumber(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "ValidateStringNumber",
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any) {
					if (typeof value !== "string" && typeof value !== "number")
						return false;
					return true;
				},
			},
		});
	};
}
