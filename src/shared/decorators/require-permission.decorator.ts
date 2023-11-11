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
