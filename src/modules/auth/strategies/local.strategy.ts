/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 15:57:05
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 12:15:37
 * @FilePath: \cms\src\modules\auth\strategies\local.strategy.ts
 * @Description:
 */
import { UsersService } from "@/modules/users/users.service";
import { StrategyEnum } from "@/shared/enums/strategy.enum";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(
	//这里的Strategy是passport-local的Strategy 而不是passport-jwt的Strategy
	Strategy,
	StrategyEnum.LOCAL,
) {
	constructor(
		private readonly usersService: UsersService,
		private readonly logger: AppLoggerSevice,
	) {
		super({
			usernameField: "name",
			passwordField: "password",
			passReqToCallback: true,
		});
		this.logger.setContext(LocalStrategy.name);
	}

	async validate(request: Request, name: string, password: string) {
		this.logger.log(`${this.validate.name} was called`);
		this.logger.warn(`name: ${name} password: ${password}`, this.validate.name);
		const user = await this.usersService.validateUser(name, password);
		//如果验证通过 自动会在request上添加user属性
		return user;
	}
}
