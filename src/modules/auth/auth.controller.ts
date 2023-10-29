/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 12:17:08
 * @FilePath: \cms\src\modules\auth\auth.controller.ts
 * @Description:
 */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppLoggerSevice } from '@/shared/logger/logger.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterAccountDto } from './dtos/register-account';
import { ExportLoginDto } from './dtos/export-login.dto';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-response.dto';
import { JwtAccessGuard } from '@/shared/guards/jwt-access.guard';
import { JwtRefreshGuard } from '@/shared/guards/jwt-refresh.guard';
import { GetCurrentUserID } from '@/shared/decorators/get-current-user-id.decorator';
import { LoginAccountDto } from './dtos/login-account.dto';

@ApiTags('用户登录注册模块')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLoggerSevice,
  ) {
    this.logger.setContext(AuthController.name);
  }

  /**
   * 用户登录
   * @param loginAccountDto 登录信息
   * @returns
   */
  @Post('/login')
  @ApiOperation({
    summary: '用户登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: SwaggerBaseApiResponse(ExportLoginDto),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '用户名或密码错误',
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginAccountDto: LoginAccountDto) {
    return this.authService.login(loginAccountDto);
  }

  /**
   * 用户注册
   * @param registerAccountDto 注册信息
   * @returns
   */
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerAccountDto: RegisterAccountDto) {
    return this.authService.register(registerAccountDto);
  }

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  testLogin() {
    return 'test';
  }

  @Post('/refresh-token')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@GetCurrentUserID() id: string) {
    return this.authService.refreshToken(id);
  }
}
