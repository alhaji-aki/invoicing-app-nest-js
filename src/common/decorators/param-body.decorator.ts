import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return { ...request.params, ...request.body };
  },
);
