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
