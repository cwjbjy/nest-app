import { Controller, Post, Get, Request } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/login')
  async login() {
    //可先从数据库中查询用户，将用户信息作为载荷，生成token
    const user = { userId: '1', username: '张三', role: 1 };
    const accessToken = this.userService.createToken(user);
    return {
      accessToken,
    };
  }

  @Get()
  getUser(@Request() req) {
    /* auth.strategy.ts中，validate方法返回的值会自动创建一个user对象，
    并将其作为 req.user 分配给请求对象。
    之后的在别的模块，直接使用req.user便可获取用户信息 */
    return req.user;
  }
}
