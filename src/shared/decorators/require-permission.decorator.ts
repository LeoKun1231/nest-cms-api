/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-03 15:55:23
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:50:54
 * @FilePath: \cms\src\shared\decorators\require-permission.decorator.ts
 * @Description:
 */
import { SetMetadata } from "@nestjs/common";
import { DecoratorEnum } from "../enums/decorator.enum";
import { PermissionEnum } from "../enums/permission.enum";

export interface RequirePermissionOptions {
	permission: PermissionEnum[];
	logical: "or" | "and";
}

export const RequirePermission = (
	permission: PermissionEnum | PermissionEnum[],
	logical?: "or" | "and",
) => {
	return SetMetadata<DecoratorEnum, RequirePermissionOptions>(
		DecoratorEnum.REQUIRE_PERMISSION,
		{
			permission: Array.isArray(permission) ? permission : [permission],
			logical: logical || "or",
		},
	);
};
