/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 18:09:41
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 22:51:58
 * @FilePath: \cms\src\shared\interceptors\transform.interceptor.ts
 * @Description:.
 */
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { AppLoggerSevice } from "../logger";

@Injectable()
export class TransformResultInterceptor implements NestInterceptor {
	constructor(private readonly logger: AppLoggerSevice) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		// 在请求进入控制器之前，对请求数据进行处理
		if (request.body) {
			this.trimStrings(request.body);
		}

		return next.handle().pipe(
			map((data) => {
				// 在请求返回之前，对返回数据进行处理
				const result = {
					data,
					code: 200,
					message: "操作成功",
				};
				// 记录日志
				this.logger.setContext(context.getClass().name);
				this.logger.log(JSON.stringify(result));
				return result;
			}),
		);
	}

	private trimStrings(data: any): any {
		if (data instanceof Object) {
			// 递归遍历对象，去掉字符串两端的空格
			Object.keys(data).forEach((key) => {
				if (typeof data[key] === "string") {
					if (data[key].trim() == "") {
						data[key] = undefined;
					}
				} else if (data[key] instanceof Object) {
					this.trimStrings(data[key]);
				}
			});
		}
	}
}
