import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class FoodSchema {
  [x: string]: any;
  @Prop()
  name: string;

  @Prop()
  describe: string;

  @Prop()
  burden: string;

  @Prop()
  image: string;
}

@Schema()
export class Market {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop([FoodSchema])
  foods: [FoodSchema];
}

// 定义Market模式类的文档类型，这是mongoose处理后带有一些额外字段的Market类实例。
export type MarketDocument = HydratedDocument<Market>;

// 创建并返回Market模式的实例，供nestjs/mongoose使用。
export const MarketSchema = SchemaFactory.createForClass(Market);
