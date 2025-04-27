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
      { _id: updateMarketDto.categoryId },
      {
        $push: {
          foods: updateMarketDto.foods,
        },
      },
    );
    return '添加成功';
  }

  async deleteFood(deleteMarketDto: DeleteFoodDto) {
    if (deleteMarketDto.image) {
      const image = deleteMarketDto.image;
      const fileName = path.basename(image);
      const imagePath = join(
        __dirname,
        '../../..',
        'public/images/market',
        fileName,
      );
      fs.unlinkSync(imagePath);
    }

    await this.marketModel.updateOne(
      { _id: deleteMarketDto.categoryId },
      {
        $pull: {
          foods: { _id: deleteMarketDto.foodId },
        },
      },
    );
    return '删除成功';
  }

  async updateFoodWithNum(foodIds: string[], num: number) {
    // 为每个 foodId 创建一个 arrayFilter 条件
    const arrayFilters = foodIds.map((id, index) => ({
      [`elem${index}._id`]: id,
    }));

    // 动态构建更新操作
    const update = {
      $inc: foodIds.reduce((acc, id, index) => {
        acc[`foods.$[elem${index}].num`] = num;
        return acc;
      }, {}),
    };

    return this.marketModel.updateMany({}, update, {
      arrayFilters: arrayFilters,
      new: true,
    });
  }

  async updateFoodWithoutImage(updateFoodDto: UpdateFoodDto) {
    //之后使用事务进行优化

    //分类不变
    if (updateFoodDto.categoryId === updateFoodDto.targetCategoryId) {
      await this.marketModel.updateOne(
        {
          _id: updateFoodDto.categoryId,
          'foods._id': updateFoodDto.foodId,
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
    } else {
      //分类变动
      const sourceCategory = await this.marketModel.findById(
        updateFoodDto.categoryId,
      );

      const dishIndex = sourceCategory.foods.findIndex(
        (f) => f._id.toString() === updateFoodDto.foodId,
      );

      const food = sourceCategory.foods[dishIndex].toObject();

      // 创建更新后的菜品对象
      const updatedDish = {
        ...food,
        name: updateFoodDto.name,
        describe: updateFoodDto.describe,
        burden: updateFoodDto.burden,
      };

      if (updateFoodDto.image) {
        updatedDish.image = updateFoodDto.image;
      }

      //从原分类删除
      await this.marketModel.updateOne(
        { _id: updateFoodDto.categoryId },
        { $pull: { foods: { _id: updateFoodDto.foodId } } },
      );

      //添加到目标分类
      await this.marketModel.updateOne(
        { _id: updateFoodDto.targetCategoryId },
        { $push: { foods: updatedDish } },
      );
    }

    return '更新成功';
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
    await this.updateFoodWithoutImage(updateFoodDto);
    return '添加成功';
  }

  //图片已存储，将图片信息返回给接口
  uploadFile(filename) {
    return `/static/images/market/${filename}`;
  }
}
