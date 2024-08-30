import { extname, join } from 'path';

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { isEmpty } from 'lodash';
import { diskStorage } from 'multer';
import { Role } from 'src/core/decorators/require-role.decorator';

import { manageMenu, menu } from './constant';
import { UserDto, RegisterDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() params: UserDto) {
    const data = await this.userService.findUser(params);
    if (isEmpty(data))
      throw new HttpException('查询结果为空', HttpStatus.BAD_REQUEST);
    const accessToken = this.userService.createToken(params);
    return {
      token: accessToken,
      auth: data[0].role === Role.SUPER_ADMIN ? manageMenu : menu,
    };
  }

  @Post('/register')
  async register(@Body() params: RegisterDto) {
    const user = await this.userService.findUserFromName(params);
    if (!isEmpty(user))
      throw new HttpException('用户名已存在', HttpStatus.FORBIDDEN);
    const data = await this.userService.addUser(params);
    return data;
  }

  @Get('/user')
  async getUsers() {
    const data = await this.userService.getUsers();
    return data;
  }

  @Get('/getUser')
  async getUser(@Query('user_name') user_name) {
    const data = await this.userService.getUser(user_name);
    return data;
  }

  @Delete('/deleteUser')
  async deleteUser(@Query('id') id) {
    const data = await this.userService.deleteUser(id);
    return data;
  }

  @Put('/updateUser')
  async updateUser(@Body() params: UpdateUserDto) {
    const data = await this.userService.updateUser(params);
    return data;
  }

  @Get('/getImage')
  async getImage(@Query('user_name') user_name) {
    const data = await this.userService.getImage(user_name);
    return data;
  }

  @Post('/uploadImage')
  // 使用名称为 'file' 的字段来接收上传的文件
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../..', 'public/images'),
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_name') user_name,
  ) {
    const data = await this.userService.uploadFile(file.filename, user_name);
    return data;
  }
}
