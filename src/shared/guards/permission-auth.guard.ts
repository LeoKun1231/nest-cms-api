import { RolesService } from "@/modules/roles/roles.service";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequirePermissionOptions } from "../decorators/require-permission.decorator";
import { DecoratorEnum } from "../enums/decorator.enum";
import { PermissionEnum } from "../enums/permission.enum";
import { JwtPayloadInterface } from "../interfaces/jwt-payload.interface";

@Injectable()
export class PermissionAuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly roleService: RolesService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		//1.获取当前请求的路由上的装饰器
		const permissionOptions =
			this.reflector?.getAllAndOverride<RequirePermissionOptions>(
				DecoratorEnum.REQUIRE_PERMISSION,
				[context.getHandler(), context.getClass()],
			);

		//2.如果没有装饰器，直接返回true->表示可以访问
		if (!permissionOptions || !permissionOptions.permission.length) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		const user = request.user as JwtPayloadInterface;
		console.log(
			"🚀 ~ file: permission-auth.guard.ts:37 ~ PermissionAuthGuard ~ canActivate ~ user:",
			user,
		);
		// 3.如果没有用户信息，直接返回false->表示不可以访问
		if (!user) return false;

		// 4.如果是超级管理员，直接返回true->表示可以访问
		if (user.roleId === 1) return true;

		// 5.获取用户角色
		const role = await this.roleService.findRoleWithMenuList(user.roleId);
		// 6.获取用户权限
		const userPermissions = role.menuList
			.map((item) => {
				if (item.permission !== "null" && item.permission) {
					return item.permission;
				}
			})
			.filter((item) => item);
		const { permission: requirePermissions, logical } = permissionOptions;
		// 7.如果用PermissionEnum.All 则直接放行
		if (userPermissions.includes(PermissionEnum.ALL)) return true;

		// 8.判断是否有权限
		const hasPermission =
			logical == "or"
				? requirePermissions.some((item) => userPermissions.includes(item))
				: requirePermissions.every((item) => userPermissions.includes(item));

		if (!hasPermission) {
			throw new ForbiddenException("抱歉,没有权限~");
		}

		return true;
	}
}
