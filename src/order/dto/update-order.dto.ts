import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class DeleteOrderDto {
  @ApiProperty({ description: '菜单id', required: true })
  @IsNotEmpty({ message: '缺少菜单id' })
  readonly id: string;
}
