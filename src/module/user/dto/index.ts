import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UserDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ message: '缺少姓名' })
  readonly userName: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '缺少密码' })
  readonly password: string;
}

export class UserWithoutPasswordDto {
  @ApiProperty({ description: '用户名', required: true })
  @IsNotEmpty({ message: '缺少姓名' })
  readonly userName: string;
}

export class RegisterDto extends UserDto {
  @ApiProperty({ description: '创建时间', required: true })
  @IsNotEmpty({ message: '缺少创建时间' })
  readonly createTime: string;

  @ApiProperty({ description: '头像信息', required: true })
  @IsNotEmpty({ message: '缺少头像信息' })
  readonly photo: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '姓名', required: true })
  @IsNotEmpty({ message: '缺少姓名' })
  readonly userName: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '缺少密码' })
  readonly password: string;

  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: '缺少id' })
  readonly id: string;
}

export class UserWithIdDTO {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: '缺少id' })
  readonly id: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ description: '用户名', required: true })
  userName: string;
}
