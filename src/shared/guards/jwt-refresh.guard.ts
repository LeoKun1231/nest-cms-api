/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-21 17:03:40
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 09:50:00
 * @FilePath: \cms\src\shared\guards\jwt-refresh.guard.ts
 * @Description:
 */
import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { StrategyEnum } from "../enums";

@Injectable()
export class JwtRefreshGuard extends AuthGuard(StrategyEnum.JWT_REFRESH) {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException(`${info}`);
		}
		return user;
	}
}
