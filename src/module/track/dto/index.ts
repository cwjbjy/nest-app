import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class TrackDto {
  @ApiProperty({ description: '版本信息', required: true })
  @IsNotEmpty({ message: '缺少版本信息' })
  readonly userData: { vs: string };

  @ApiProperty({ description: '设备信息', required: true })
  @IsNotEmpty({ message: '缺少设备信息' })
  readonly device: { browser: { name: string } };

  @ApiProperty({ description: '用户信息', required: true })
  @IsNotEmpty({ message: '缺少用户信息' })
  readonly uuid: string;

  @ApiProperty({ description: '上报类型', required: true })
  @IsNotEmpty({ message: '缺少上报类型' })
  readonly type: string;

  @ApiProperty({ description: '当前时间', required: true })
  @IsNotEmpty({ message: '缺少当前时间' })
  readonly date: string;

  @ApiProperty({ description: '上报信息' })
  readonly data: any;
}

export class TrackOldDto {
  @ApiProperty({ description: '用户信息', required: true })
  @IsNotEmpty({ message: '用户信息' })
  baseInfo: { browserType: string; appName: string };

  @ApiProperty({ description: '行为信息', required: true })
  @IsNotEmpty({ message: '行为信息' })
  eventInfo: {
    url: string;
    referer: string;
    triggerTime: string;
    delay: string;
  }[];
}
