import * as fs from 'fs';
import { join } from 'path';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMarketDto } from './dto/create-market.dto';
import {
  UpdateMarketDto,
  UpdateFoodDto,
  DeleteFoodDto,
} from './dto/update-market.dto';
import { Market } from './entities/market.entity';

@Injectable()
export class MarketService {
  constructor(@InjectModel(Market.name) private marketModel: Model<Market>) {}

  async create(createMarketDto: CreateMarketDto) {
    const food = new this.marketModel(createMarketDto);

    return food.save();
  }

  async deleteCategory(name: string) {
    await this.marketModel.deleteOne({
      name,
    });

    return '删除成功';
  }

  async findAll() {
    const foods = await this.marketModel.find();
    return foods;
  }

  async findFoods(text: string) {
    const food = await this.marketModel.find({
      'foods.burden': {
        $regex: `.*${text}.*`,
        $options: 'i',
      },
    });
    return food;
  }

  async addFood(updateMarketDto: UpdateMarketDto) {
    await this.marketModel.updateOne(
      { name: updateMarketDto.name },
      {
        $push: {
          foods: updateMarketDto.foods,
        },
      },
    );
    return '添加成功';
  }

  async deleteFood(deleteMarketDto: DeleteFoodDto) {
    const image = deleteMarketDto.image;
    const fileName = path.basename(image);
    const imagePath = join(
      __dirname,
      '../../..',
      'public/images/market',
      fileName,
    );
    fs.unlinkSync(imagePath);
    await this.marketModel.updateOne(
      { name: deleteMarketDto.category },
      {
        $pull: {
          foods: { _id: deleteMarketDto.id },
        },
      },
    );
    return '删除成功';
  }

  async updateFoodWithoutImage(updateFoodDto: UpdateFoodDto) {
    await this.marketModel.updateOne(
      {
        name: updateFoodDto.category,
        'foods._id': updateFoodDto.id,
      },
      {
        $set: {
          'foods.$.name': updateFoodDto.name,
          'foods.$.burden': updateFoodDto.burden,
          'foods.$.describe': updateFoodDto.describe,
        },
      },
    );
    return '添加成功';
  }

  async updateFood(updateFoodDto: UpdateFoodDto) {
    const image = updateFoodDto.oldImage;
    const fileName = path.basename(image);
    const imagePath = join(
      __dirname,
      '../../..',
      'public/images/market',
      fileName,
    );
    fs.unlinkSync(imagePath);
    await this.marketModel.updateOne(
      {
        name: updateFoodDto.category,
        'foods._id': updateFoodDto.id,
      },
      {
        $set: {
          'foods.$.name': updateFoodDto.name,
          'foods.$.burden': updateFoodDto.burden,
          'foods.$.describe': updateFoodDto.describe,
          'foods.$.image': updateFoodDto.image,
        },
      },
    );
    return '添加成功';
  }

  //图片已存储，将图片信息返回给接口
  uploadFile(filename) {
    return `/static/images/market/${filename}`;
  }
}
