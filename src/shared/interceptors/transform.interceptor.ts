/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-15 18:09:41
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-17 10:35:23
 * @FilePath: \cms\src\common\interceptors\transform.interceptor.ts
 * @Description:.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AppLoggerSevice } from '@/shared/logger/logger.service';

@Injectable()
export class TransformResultInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerSevice) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = {
          data,
          code: 200,
          message: '操作成功',
        };
        // 记录日志
        this.logger.setContext(context.getClass().name);
        this.logger.log(JSON.stringify(result));
        return result;
      }),
    );
  }
}
