/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-21 17:03:40
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:52:43
 * @FilePath: \cms\src\shared\guards\jwt-local.guard.ts
 * @Description:
 */
import { StrategyEnum } from "@/shared/enums/strategy.enum";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtLocalGuard extends AuthGuard(StrategyEnum.LOCAL) {}
