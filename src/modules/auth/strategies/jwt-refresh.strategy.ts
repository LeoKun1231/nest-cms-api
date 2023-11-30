/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 15:56:50
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 11:02:39
 * @FilePath: \cms\src\modules\auth\strategies\jwt-refresh.strategy.ts
 * @Description:
 */
import { EnvEnum, StrategyEnum } from "@/shared/enums";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	StrategyEnum.JWT_REFRESH,
) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
			secretOrKey: Buffer.from(
				configService.get<string>(EnvEnum.JWT_PUBLIC_KEY),
				"base64",
			).toString("utf-8"),
			algorithms: ["RS256"],
		});
	}

	async validate(payload) {
		return {
			id: payload.id,
		};
	}
}
