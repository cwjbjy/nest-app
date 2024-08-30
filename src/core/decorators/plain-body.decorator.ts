import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as rawbody from 'raw-body';

export const PlainBody = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.readable) {
      const data = (await rawbody(req)).toString().trim();
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } else {
      return data;
    }
  },
);
