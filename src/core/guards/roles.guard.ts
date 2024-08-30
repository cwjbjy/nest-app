import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/core/decorators/require-role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 全局配置，
    const req = ctx.switchToHttp().getRequest();

    const role = this.reflector.getAllAndOverride(ROLES_KEY, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);

    if (role && req.user.role > role) {
      throw new ForbiddenException('对不起，您无权操作');
    }

    return true;
  }
}
