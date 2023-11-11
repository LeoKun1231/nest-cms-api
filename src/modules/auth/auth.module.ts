/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 19:57:06
 * @FilePath: \cms\src\modules\auth\auth.module.ts
 * @Description:
 */
import { User } from "@/shared/entities/user.entity";
import { EnvEnum } from "@/shared/enums/env.enum";
import { StrategyEnum } from "@/shared/enums/strategy.enum";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: StrategyEnum.JWT_ACCESS }),
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				publicKey: Buffer.from(
					configService.get<string>(EnvEnum.JWT_PUBLIC_KEY),
					"base64",
				).toString("utf-8"),
				privateKey: Buffer.from(
					configService.get<string>(EnvEnum.JWT_PRIVATE_KEY),
					"base64",
				).toString("utf-8"),
				signOptions: {
					algorithm: "RS256",
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		ConfigService,
		LocalStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
	],
})
export class AuthModule {}
