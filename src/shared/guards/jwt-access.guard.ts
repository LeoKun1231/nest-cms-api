/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-21 17:03:40
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 09:49:29
 * @FilePath: \cms\src\shared\guards\jwt-access.guard.ts
 * @Description:
 */
import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { StrategyEnum } from "../enums";
import { DecoratorEnum } from "../enums/decorator.enum";

@Injectable()
export class JwtAccessGuard extends AuthGuard(StrategyEnum.JWT_ACCESS) {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride(DecoratorEnum.IS_PUBLIC, [
			context.getHandler(),
			context.getClass(),
		]);
		//如果是公共路由，直接放行 不进行jwt验证
		if (isPublic) return true;
		return super.canActivate(context);
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException(`${info}`);
		}
		return user;
	}
}
