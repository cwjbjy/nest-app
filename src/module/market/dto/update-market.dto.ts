import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreateFoodDto } from './create-market.dto';

export class UpdateMarketDto {
  @ApiProperty({ description: '菜的分类', required: true })
  @IsNotEmpty({ message: '缺少分类' })
  readonly categoryId: string;

  @ApiProperty({ description: '菜', required: true })
  @IsNotEmpty({ message: '缺少菜' })
  readonly foods: CreateFoodDto;
}

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @ApiProperty({ description: '菜的分类', required: true })
  @IsNotEmpty({ message: '缺少分类' })
  readonly categoryId: string;

  @ApiProperty({ description: '菜的新分类', required: true })
  @IsNotEmpty({ message: '缺少菜的新分类' })
  readonly targetCategoryId: string;

  @ApiProperty({ description: '食物id', required: true })
  @IsNotEmpty({ message: '缺少食物id' })
  readonly foodId: string;

  @ApiProperty({ description: '旧图片地址' })
  readonly oldImage: string;
}

export class DeleteFoodDto {
  @ApiProperty({ description: '菜的分类', required: true })
  @IsNotEmpty({ message: '缺少分类' })
  readonly categoryId: string;

  @ApiProperty({ description: '食物id', required: true })
  @IsNotEmpty({ message: '缺少食物id' })
  readonly foodId: string;

  @ApiProperty({ description: '图片地址' })
  readonly image: string;
}
