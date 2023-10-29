/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-19 19:26:09
 * @FilePath: \cms\src\modules\auth\auth.service.ts
 * @Description:
 */
import { AppLoggerSevice } from '@/shared/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterAccountDto } from './dtos/register-account';
import { JwtService } from '@nestjs/jwt';
import { ExportLoginDto } from './dtos/export-login.dto';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from '@/shared/enums/env.enum';
import { plainToClass } from 'class-transformer';
import { LoginAccountDto } from './dtos/login-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLoggerSevice,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * 登录
   * @param loginAccountDto 登录信息
   * @returns
   */
  async login(loginAccountDto: LoginAccountDto) {
    this.logger.log(`${this.login.name} was called`);

    const user = await this.userService.validateUser(
      loginAccountDto.name,
      loginAccountDto.password,
    );

    return this.getAccessAndRefreshToken(user.id, user.name);
  }

  /**
   * 注册
   * @param registerAccountDto 注册信息
   * @returns
   */
  register(registerAccountDto: RegisterAccountDto) {
    this.logger.log(`${this.register.name} was called`);
    return this.userService.createUser(
      registerAccountDto.name,
      registerAccountDto.password,
    );
  }

  /**
   * 刷新token
   * @param id 用户id
   * @returns
   */
  async refreshToken(id: string) {
    this.logger.log(`${this.refreshToken.name} was called`);
    const user = await this.userService.findUserById(id);
    return this.getAccessAndRefreshToken(user.id, user.name);
  }

  /**
   * 获取access_token和refresh_token
   * @param id 用户id
   * @param name 用户名
   * @returns
   */
  getAccessAndRefreshToken(id: string, name: string): ExportLoginDto {
    this.logger.log(`${this.getAccessAndRefreshToken.name} was called`);
    const payload = { id, name };
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
