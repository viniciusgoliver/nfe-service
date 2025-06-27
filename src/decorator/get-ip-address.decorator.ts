import { createParamDecorator } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';

export const GetIpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  },
);
