/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 09:40:59
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-22 09:31:33
 * @FilePath: \cms\src\shared\logger\logger.service.ts
 * @Description:
 */
import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerSevice {
  private context?: string;

  constructor(private readonly logger: Logger) {}

  public setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    return this.logger.log(message, context || this.context);
  }

  error(message: any, trace?: string, context?: string): any {
    return this.logger.error(message, trace, context || this.context);
  }

  warn(message: any, context?: string): any {
    return this.logger.warn(message, context || this.context);
  }
}
