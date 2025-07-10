import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const Userd = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
