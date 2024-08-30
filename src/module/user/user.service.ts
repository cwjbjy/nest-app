import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/core/decorators/require-role.decorator';
import query from 'src/core/lib/mysql';

import { UserDto, RegisterDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  //根据用户名与密码查找用户
  async findUser(params: UserDto) {
    const { userName, passWord } = params;

    const data = await query(
      'SELECT * FROM USER WHERE user_name=? and password=?;',
      [userName, passWord],
    );

    return data;
  }

  //根据用户名查找用户
  async findUserFromName(params: RegisterDto) {
    const { userName } = params;

    const data = await query('SELECT * FROM USER WHERE user_name=?;', [
      userName,
    ]);

    return data;
  }

  //新增用户
  async addUser(params: RegisterDto) {
    const { userName, passWord, createTime, photo } = params;

    await query(
      'INSERT INTO USER (user_name,password,authority,role,createTime,photo) VALUES (?,?,?,?,?,?);',
      [userName, passWord, Role.HUMAN, Role.HUMAN, createTime, photo],
    );

    return { messgae: '注册成功' };
  }

  //查找所有用户
  async getUsers() {
    const data = await query('SELECT * FROM USER;');
    return data;
  }

  //查找单条用户创建时间
  async getUser(user_name: string) {
    const data = await query('SELECT createTime FROM USER WHERE user_name=?;', [
      user_name,
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
    const { id, user_name, password } = params;
    await query('UPDATE USER SET user_name=?, password=? WHERE id=?;', [
      user_name,
      password,
      id,
    ]);
    return { messgae: '修改成功' };
  }

  //查询用户头像
  async getImage(user_name: string) {
    const data = await query('SELECT photo FROM USER WHERE user_name=?;', [
      user_name,
    ]);
    return data;
  }

  //更新头像（图片已存储，将图片信息更新到数据库中）
  async uploadFile(filename, user_name) {
    await query('UPDATE USER SET photo=? WHERE user_name=?;', [
      filename,
      user_name,
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
