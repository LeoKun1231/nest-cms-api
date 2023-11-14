/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:44:12
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:50:40
 * @FilePath: \cms\src\shared\decorators\public.decorator.ts
 * @Description:
 */
import { SetMetadata } from "@nestjs/common";
import { DecoratorEnum } from "../enums/decorator.enum";

export const Public = () => SetMetadata(DecoratorEnum.IS_PUBLIC, true);
