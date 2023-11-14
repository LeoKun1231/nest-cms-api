/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 21:26:30
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:53:16
 * @FilePath: \cms\src\shared\redis\redis.module.ts
 * @Description:
 */
import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
