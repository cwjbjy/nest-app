import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ description: '名称', required: true })
  @IsNotEmpty({ message: '缺少菜名' })
  readonly name: string;

  @ApiProperty({ description: '菜的做法', required: true })
  @IsNotEmpty({ message: '缺少描述' })
  readonly describe: string;

  @ApiProperty({ description: '菜的配料', required: true })
  @IsNotEmpty({ message: '缺少配料' })
  readonly burden: string;

  @ApiProperty({ description: '菜的图片', required: true })
  @IsNotEmpty({ message: '缺少图片' })
  readonly image: string;

  @ApiProperty({ description: '菜的被点数量', required: true })
  @IsNotEmpty({ message: '缺少数量' })
  readonly num: number;
}

export class CreateMarketDto {
  @ApiProperty({ description: '名称', required: true })
  @IsNotEmpty({ message: '缺少名称' })
  readonly name: string;

  @ApiProperty({ description: '图标', required: true })
  @IsNotEmpty({ message: '缺少图标' })
  readonly image: string;

  @ApiProperty({ description: '菜的标签' })
  @IsNotEmpty({ message: '缺少菜品' })
  readonly foods: CreateFoodDto[];
}

export class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ description: '用户名', required: true })
  userId: string;
}
