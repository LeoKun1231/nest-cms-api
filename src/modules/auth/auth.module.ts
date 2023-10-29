/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 19:57:06
 * @FilePath: \cms\src\modules\auth\auth.module.ts
 * @Description:
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { StrategyEnum } from '@/shared/enums/strategy.enum';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from '@/shared/enums/env.enum';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/shared/entities/Users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: StrategyEnum.JWT_ACCESS }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        publicKey: Buffer.from(
          configService.get<string>(EnvEnum.JWT_PUBLIC_KEY),
          'base64',
        ).toString('utf-8'),
        privateKey: Buffer.from(
          configService.get<string>(EnvEnum.JWT_PRIVATE_KEY),
          'base64',
        ).toString('utf-8'),
        signOptions: {
          algorithm: 'RS256',
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
