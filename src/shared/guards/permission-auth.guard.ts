/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-03 16:28:10
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:52:48
 * @FilePath: \cms\src\shared\guards\permission-auth.guard.ts
 * @Description:
 */
import { RolesService } from "@/modules/roles/roles.service";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RedisService } from "../redis/redis.service";
import { RequirePermissionOptions } from "../decorators";
import { DecoratorEnum, PermissionEnum, RedisKeyEnum } from "../enums";
import { JwtPayloadInterface } from "../interfaces";

@Injectable()
export class PermissionAuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly roleService: RolesService,
		private readonly redisService: RedisService,
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

		const accessToken = await this.redisService.get(
			RedisKeyEnum.LoginKey + user.id,
		);

		// 3.如果没有accessToken，直接返回false->表示不可以访问
		if (!accessToken) throw new UnauthorizedException("请先登录~");

		// 4.如果没有用户信息，直接返回false->表示不可以访问
		if (!user) throw new UnauthorizedException("请先登录~");

		// 5.如果是超级管理员，直接返回true->表示可以访问
		if (user.roleId === 1) return true;

		// 6.获取用户角色
		const role = await this.roleService.findRoleWithMenuList(user.roleId);
		// 7.获取用户权限
		const userPermissions = role.menuList
			.map((item) => {
				if (item.permission !== "null" && item.permission) {
					return item.permission;
				}
			})
			.filter((item) => item);

		const { permission: requirePermissions, logical } = permissionOptions;

		// 8.如果用PermissionEnum.All 则直接放行
		if (userPermissions.includes(PermissionEnum.ALL)) return true;

		// 9.判断是否有权限
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
