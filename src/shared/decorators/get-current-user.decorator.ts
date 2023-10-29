import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (param: any, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    return req.user[param];
  },
);
