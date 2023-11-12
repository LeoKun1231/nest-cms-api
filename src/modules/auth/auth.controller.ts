/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 12:17:08
 * @FilePath: \cms\src\modules\auth\auth.controller.ts
 * @Description:
 */
import { GetCurrentUserID } from "@/shared/decorators/get-current-user-id.decorator";
import { Public } from "@/shared/decorators/public.decorator";
import {
	BaseApiErrorResponse,
	SwaggerBaseApiResponse,
} from "@/shared/dtos/base-api-response.dto";
import { JwtAccessGuard } from "@/shared/guards/jwt-access.guard";
import { JwtRefreshGuard } from "@/shared/guards/jwt-refresh.guard";
import { AppLoggerSevice } from "@/shared/logger/logger.service";
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
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ExportLoginDto } from "./dtos/export-login.dto";
import { LoginAccountDto } from "./dtos/login-account.dto";

@ApiTags("用户登录注册模块")
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
	@Post("/login")
	@ApiOperation({
		summary: "用户登录",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "登录成功",
		type: SwaggerBaseApiResponse(ExportLoginDto),
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "用户名或密码错误",
		type: BaseApiErrorResponse,
	})
	@HttpCode(HttpStatus.OK)
	@Public()
	@UseInterceptors(ClassSerializerInterceptor)
	login(@Body() loginAccountDto: LoginAccountDto) {
		return this.authService.login(loginAccountDto);
	}

	@Get("/test")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAccessGuard)
	testLogin() {
		return "test";
	}

	@Post("/refresh-token")
	@UseGuards(JwtRefreshGuard)
	@HttpCode(HttpStatus.OK)
	refreshToken(@GetCurrentUserID() id: string) {
		return this.authService.refreshToken(+id);
	}
}
