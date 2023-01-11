import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomBody = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const entity = data ? { entity: request.params[data] } : {};

    return {
      authUser: request.user,
      ...entity,
      ...request.body,
    };
  },
);
