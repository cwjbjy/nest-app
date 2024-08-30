import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  //生成令牌
  createToken(payload: { username: string; userId: string }): string {
    //jwt会使用secret中配置的密钥，对payload进行加密，从而生成token
    //这里根据用户名与用户ID进行加密，生成token
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
