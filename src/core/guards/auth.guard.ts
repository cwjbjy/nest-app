import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { pathToRegexp } from 'path-to-regexp';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList = [];
  constructor(private readonly config: ConfigService) {
    super();
    this.globalWhiteList = [].concat(this.config.get('router.whitelist') || []);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isInWhiteList = this.checkWhiteList(context);
    //如果在白名单内，直接返回true
    //否则调用super.canActivate，走PassPort策略
    if (isInWhiteList) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * 检查接口是否在白名单内
   * @param context
   * @returns
   */
  checkWhiteList(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url);
      }
      return false;
    });
    return i > -1;
  }
}
