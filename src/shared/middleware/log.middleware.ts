import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { getReqMainInfo } from '@/shared/utils';
import { AppLoggerSevice } from '@/shared/logger/logger.service';
@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerSevice) {}
  use(req: Request, res: Response, next: () => void) {
    // 记录日志
    this.logger.log(getReqMainInfo(req), req.url);
    next();
  }
}
