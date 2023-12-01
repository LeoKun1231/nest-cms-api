/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 12:37:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:54:01
 * @FilePath: \cms\src\app.service.ts
 * @Description:
 */
import { Injectable } from "@nestjs/common";
import { CacheEvict, Cacheable } from "./shared/decorators/cache.decorator";
import { RedisKeyEnum } from "./shared/enums";

@Injectable()
export class AppService {
	@Cacheable(RedisKeyEnum.DepartmentKey)
	getHello(): string {
		return "Hello World!";
	}

	@CacheEvict(RedisKeyEnum.DepartmentKey)
	testCachePut() {
		return "testCachePut";
	}
}
