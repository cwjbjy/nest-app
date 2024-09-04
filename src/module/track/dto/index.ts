import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class TrackDto {
  @ApiProperty({ description: '版本信息', required: true })
  @IsNotEmpty({ message: '缺少版本信息' })
  readonly userData: { vs: string };

  @ApiProperty({ description: '设备信息', required: true })
  @IsNotEmpty({ message: '缺少设备信息' })
  readonly device: { browser: string };

  @ApiProperty({ description: '当前页面', required: true })
  @IsNotEmpty({ message: '当前页面' })
  readonly url: string;

  @ApiProperty({ description: '上一页面', required: true })
  @IsNotEmpty({ message: '上一页面' })
  readonly referrer: string;

  @ApiProperty({ description: '当前时间', required: true })
  @IsNotEmpty({ message: '当前时间' })
  readonly date: string;

  @ApiProperty({ description: '停留时间', required: true })
  @IsNotEmpty({ message: '停留时间' })
  readonly duration: string;
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
