/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-19 19:26:09
 * @FilePath: \cms\src\modules\auth\auth.service.ts
 * @Description:
 */
import { EnvEnum } from "@/shared/enums/env.enum";
import { RedisKeyEnum } from "@/shared/enums/redis-key.enum";
import { JwtPayloadInterface } from "@/shared/interfaces/jwt-payload.interface";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
import { RedisService } from "@/shared/redis/redis.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { plainToClass } from "class-transformer";
import type { Request } from "express";
import * as requestIp from "request-ip";
import { UsersService } from "../users/users.service";
import { ExportLoginDto } from "./dtos/export-login.dto";
import { LoginAccountDto } from "./dtos/login-account.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(AuthService.name);
	}

	/**
	 * 登录
	 * @param loginAccountDto 登录信息
	 * @returns
	 */
	async login(loginAccountDto: LoginAccountDto, req: Request) {
		this.logger.log(`${this.login.name} was called`);

		const user = await this.userService.validateUser(
			loginAccountDto.name,
			loginAccountDto.password,
		);
		const ip = requestIp.getClientIp(req);

		await this.userService.recordUserIp(user.id, ip);

		const roleId = user.roles[0].id;
		const { accessToken } = this.getAccessAndRefreshToken(
			user.id,
			user.name,
			roleId,
		);

		await this.redisService.setex(
			RedisKeyEnum.LoginKey + user.id,
			60 * 60,
			accessToken,
		);

		return {
			id: user.id,
			name: user.name,
			token: accessToken,
		};
	}

	/**
	 * 刷新token
	 * @param id 用户id
	 * @returns
	 */
	async refreshToken(id: number) {
		this.logger.log(`${this.refreshToken.name} was called`);
		const user = await this.userService.findUserById(id);
		const roleId = user.role.id;
		return this.getAccessAndRefreshToken(user.id, user.name, roleId);
	}

	/**
	 * 获取access_token和refresh_token
	 * @param id 用户id
	 * @param name 用户名
	 * @returns
	 */
	getAccessAndRefreshToken(
		id: number,
		name: string,
		roleId: number,
	): ExportLoginDto {
		this.logger.log(`${this.getAccessAndRefreshToken.name} was called`);
		const payload = { id, name, roleId } as JwtPayloadInterface;
		return plainToClass(ExportLoginDto, {
			accessToken: this.jwtService.sign(payload, {
				expiresIn: this.configService.get(EnvEnum.JWT_ACCESS_TOKEN_EXPIRES_IN),
			}),
			refreshToken: this.jwtService.sign(
				{ id },
				{
					expiresIn: this.configService.get(
						EnvEnum.JWT_REFRESH_TOKEN_EXPIRES_IN,
					),
				},
			),
		});
	}
}
