import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { pathToRegexp } from 'path-to-regexp';
import { TOKEN_CACHE_TIME } from 'src/core/redis-cache/constant';
import { RedisCacheService } from 'src/core/redis-cache/redis-cache.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private globalWhiteList = [];
  constructor(
    private readonly config: ConfigService,
    private redisCacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secretkey'),
      passReqToCallback: true,
    });
    this.globalWhiteList = [].concat(this.config.get('router.whitelist') || []);
  }

  async validate(req, payload) {
    const isInWhiteList = this.checkWhiteList(req);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const cacheToken = await this.redisCacheService.get(
      `${payload.userName}&${payload.password}`,
    );

    //如果接口在白名单内，不进行判断
    if (!isInWhiteList) {
      if (!cacheToken) {
        throw new UnauthorizedException('token 已过期');
      }

      if (token != cacheToken) {
        throw new UnauthorizedException('在其他地方登录');
      }

      //增加token时间
      this.redisCacheService.set(
        `${payload.userName}&${payload.password}`,
        token,
        TOKEN_CACHE_TIME,
      );
    }

    return payload;
  }

  checkWhiteList(req): boolean {
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
