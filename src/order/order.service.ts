import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateOrderDto } from './dto/create-order.dto';
import { DeleteOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    const food = new this.orderModel({
      ...createOrderDto,
      createdAt: new Date(),
    });
    return food.save();
  }

  async find(skip, limit) {
    const foods = await this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip) // 跳过指定数量的记录
      .limit(limit)
      .exec();

    // 获取总记录数
    const total = await this.orderModel.countDocuments().exec();
    return { foods, total };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number) {
  //   return `This action updates a #${id} order`;
  // }

  async remove(data: DeleteOrderDto) {
    await this.orderModel.deleteOne({ _id: data.id });
    return '删除成功';
  }
}
