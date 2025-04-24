import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

import { CreateOrderDto } from './dto/create-order.dto';
import { DeleteOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@ApiTags('订单')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '新增订单' })
  @ApiBody({
    type: CreateOrderDto,
    required: true,
  })
  @Post('/addOrder')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: '查询整个订单' })
  @Get('/getAll')
  findAll() {
    return this.orderService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderService.findOne(+id);
  // }

  @Delete('/deleteOrder')
  remove(@Body() data: DeleteOrderDto) {
    return this.orderService.remove(data);
  }
}
