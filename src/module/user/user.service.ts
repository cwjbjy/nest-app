import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { Role } from 'src/core/decorators/require-role.decorator';
import query from 'src/core/lib/mysql';
import { TOKEN_CACHE_TIME } from 'src/core/redis-cache/constant';
import { RedisCacheService } from 'src/core/redis-cache/redis-cache.service';

import { manageMenu, menu } from './constant';
import { UserDto, RegisterDto, UpdateUserDto } from './dto';
@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private redisCacheService: RedisCacheService,
  ) {}

  async login(params: UserDto) {
    const data = await this.findUserFromName(params);
    if (isEmpty(data))
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    const password = data[0].password;
    if (!bcrypt.compareSync(params.password, password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const accessToken = this.createToken(params);
    await this.redisCacheService.set(
      `${params.userName}&${params.password}`,
      accessToken,
      TOKEN_CACHE_TIME,
    );
    return {
      token: accessToken,
      auth: data[0].role === Role.SUPER_ADMIN ? manageMenu : menu,
    };
  }

  async register(params: RegisterDto) {
    const user = await this.findUserFromName(params);
    if (!isEmpty(user))
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    const data = await this.addUser(params);
    return data;
  }

  //根据用户名查找用户
  async findUserFromName(params) {
    const { userName } = params;

    const data = await query('SELECT * FROM USER WHERE userName=?;', [
      userName,
    ]);

    return data;
  }

  //新增用户
  async addUser(params: RegisterDto) {
    const { userName, password, createTime, photo } = params;
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await query(
      'INSERT INTO USER (userName,password,authority,role,createTime,photo) VALUES (?,?,?,?,?,?);',
      [userName, newPassword, Role.HUMAN, Role.HUMAN, createTime, photo],
    );

    return { messgae: '注册成功' };
  }

  //查找所有用户
  async getUsers() {
    const data = await query('SELECT * FROM USER;');
    return data;
  }

  //查找单条用户创建时间
  async getUser(userName: string) {
    const data = await query('SELECT createTime FROM USER WHERE userName=?;', [
      userName,
    ]);
    return data[0].createTime;
  }

  //删除单条用户
  async deleteUser(id: string) {
    await query('DELETE FROM USER WHERE id=?;', [id]);
    return { messgae: '删除成功' };
  }

  //更新用户信息
  async updateUser(params: UpdateUserDto) {
    const { id, userName, password } = params;
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await query('UPDATE USER SET userName=?, password=? WHERE id=?;', [
      userName,
      newPassword,
      id,
    ]);
    return { messgae: '修改成功' };
  }

  //查询用户头像
  async getImage(userName: string) {
    const data = await query('SELECT photo FROM USER WHERE userName=?;', [
      userName,
    ]);
    return data;
  }

  //更新头像（图片已存储，将图片信息更新到数据库中）
  async uploadFile(filename, userName) {
    await query('UPDATE USER SET photo=? WHERE userName=?;', [
      filename,
      userName,
    ]);
    return { messgae: '上传成功' };
  }

  //生成令牌
  createToken(payload: UserDto): string {
    //jwt会使用secret中配置的密钥，对payload进行加密，从而生成token
    //这里根据用户名与用户ID进行加密，生成token
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
