/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 15:56:31
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 10:00:54
 * @FilePath: \cms\src\modules\auth\strategies\jwt-access.strategy.ts
 * @Description:
 */

import { EnvEnum, StrategyEnum } from "@/shared/enums";
import { JwtPayloadInterface } from "@/shared/interfaces";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
	Strategy,
	StrategyEnum.JWT_ACCESS,
) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: Buffer.from(
				configService.get<string>(EnvEnum.JWT_PUBLIC_KEY),
				"base64",
			).toString("utf-8"),
			algorithms: ["RS256"],
		});
	}

	async validate(payload): Promise<JwtPayloadInterface> {
		return {
			id: payload.id,
			name: payload.name,
			roleId: payload.roleId,
		};
	}
}
