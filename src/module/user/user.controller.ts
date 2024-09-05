import { extname, join } from 'path';

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import {
  UserDto,
  RegisterDto,
  UpdateUserDto,
  UserWithoutPasswordDto,
  UserWithIdDTO,
  FileUploadDto,
} from './dto';
import { UserService } from './user.service';
@ApiTags('用户')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '登录' })
  @Post('/login')
  login(@Body() params: UserDto) {
    return this.userService.login(params);
  }

  @ApiOperation({ summary: '注册' })
  @Post('/register')
  register(@Body() params: RegisterDto) {
    return this.userService.register(params);
  }

  @ApiOperation({ summary: '查询所有用户' })
  @Get('/users')
  async getUsers() {
    const data = await this.userService.getUsers();
    return data;
  }

  @ApiOperation({ summary: '查找单条用户' })
  @ApiBody({
    type: UserWithoutPasswordDto,
    required: true,
  })
  @Get('/findUser')
  async getUser(@Query('userName') userName) {
    const data = await this.userService.getUser(userName);
    return data;
  }

  @ApiOperation({ summary: '删除单条用户' })
  @ApiBody({
    type: UserWithIdDTO,
    required: true,
  })
  @Delete('/deleteUser')
  async deleteUser(@Query('id') id) {
    const data = await this.userService.deleteUser(id);
    return data;
  }

  @ApiOperation({ summary: '更新用户信息' })
  @Put('/updateUser')
  async updateUser(@Body() params: UpdateUserDto) {
    const data = await this.userService.updateUser(params);
    return data;
  }

  @ApiOperation({ summary: '查询用户头像' })
  @ApiBody({
    type: UserWithoutPasswordDto,
    required: true,
  })
  @Get('/getImage')
  async getImage(@Query('userName') userName) {
    const data = await this.userService.getImage(userName);
    return data;
  }

  @ApiOperation({ summary: '上传头像' })
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
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
    @Body('userName') userName,
  ) {
    const data = await this.userService.uploadFile(file.filename, userName);
    return data;
  }
}
