import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: '缺少姓名' })
  readonly userName: string;

  @IsNotEmpty({ message: '缺少密码' })
  readonly passWord: string;
}

export class RegisterDto extends UserDto {
  @IsNotEmpty({ message: '缺少创建时间' })
  readonly createTime: string;

  @IsNotEmpty({ message: '缺少头像信息' })
  readonly photo: string;
}

export class UpdateUserDto {
  @IsNotEmpty({ message: '缺少姓名' })
  readonly user_name: string;

  @IsNotEmpty({ message: '缺少密码' })
  readonly password: string;

  @IsNotEmpty({ message: '缺少id' })
  readonly id: string;
}
