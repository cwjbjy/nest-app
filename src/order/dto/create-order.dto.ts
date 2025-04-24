import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: '缺少菜名id' })
  readonly _id: string;

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

  @ApiProperty({ description: '菜的数量', required: true })
  @IsNotEmpty({ message: '缺少数量' })
  readonly value: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: '日期', required: true })
  @IsNotEmpty({ message: '缺少日期' })
  readonly date: string;

  @ApiProperty({ description: '菜单中菜的数量', required: true })
  @IsNotEmpty({ message: '缺少数量' })
  readonly num: number;

  @ApiProperty({ description: '菜品' })
  @IsNotEmpty({ message: '缺少菜品' })
  readonly foods: CreateFoodDto[];
}
