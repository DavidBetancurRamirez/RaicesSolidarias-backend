import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserActiveInterface } from '../interfaces/user.interface';

export const ActiveUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: UserActiveInterface }>();
  return request.user;
});
