/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 21:26:30
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-13 21:44:21
 * @FilePath: \cms\src\shared\redis\redis.module.ts
 * @Description:
 */
// redis.module.ts
import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
