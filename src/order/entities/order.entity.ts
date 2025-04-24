import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class FoodSchema {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  describe: string;

  @Prop()
  burden: string;

  @Prop()
  image: string;

  @Prop()
  value: number;
}

@Schema()
export class Order {
  @Prop()
  date: string;

  @Prop()
  createdAt: string;

  @Prop()
  num: number;

  @Prop([FoodSchema])
  foods: [FoodSchema];
}

export type OrderDocument = HydratedDocument<Order>;

// 创建并返回Market模式的实例，供nestjs/mongoose使用。
export const OrderSchema = SchemaFactory.createForClass(Order);
