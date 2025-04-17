import { extname, join } from 'path';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { CreateMarketDto, CreateUploadDto } from './dto/create-market.dto';
import {
  UpdateMarketDto,
  UpdateFoodDto,
  DeleteFoodDto,
} from './dto/update-market.dto';
import { MarketService } from './market.service';

@ApiTags('菜单')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: '插入单个分类' })
  @ApiBody({
    type: CreateMarketDto,
    required: true,
  })
  @Post('/addCategory')
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.create(createMarketDto);
  }

  @ApiOperation({ summary: '删除整个分类' })
  @Delete('/deleteCategory')
  deleteCategory(@Query('name') name: string) {
    return this.marketService.deleteCategory(name);
  }

  @ApiOperation({ summary: '添加新菜品' })
  @ApiBody({
    type: UpdateMarketDto,
    required: true,
  })
  @Put('/addFood')
  addFood(@Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.addFood(updateMarketDto);
  }

  @ApiOperation({ summary: '删除某个菜品' })
  @Delete('/deleteFood')
  deleteFood(@Body() deleteMarketDto: DeleteFoodDto) {
    return this.marketService.deleteFood(deleteMarketDto);
  }

  @ApiOperation({ summary: '更新某个菜品，不包含图片的更新' })
  @ApiBody({
    type: UpdateFoodDto,
    required: true,
  })
  @Patch('/updateFoodWithoutImage')
  updateFoodWithoutImage(@Body() updateFoodDto: UpdateFoodDto) {
    return this.marketService.updateFoodWithoutImage(updateFoodDto);
  }

  @ApiOperation({ summary: '更新某个菜品，包含图片的更新' })
  @ApiBody({
    type: UpdateFoodDto,
    required: true,
  })
  @Patch('/updateFood')
  updateFood(@Body() updateFoodDto: UpdateFoodDto) {
    return this.marketService.updateFood(updateFoodDto);
  }

  @ApiOperation({ summary: '查询整个菜单' })
  @Get('/getAll')
  findAll() {
    return this.marketService.findAll();
  }

  @ApiOperation({ summary: '根据burden查询菜单' })
  @Get('/findFoods')
  findFoods(@Query('text') text: string) {
    return this.marketService.findFoods(text);
  }

  @ApiOperation({ summary: '上传照片' })
  @ApiBody({
    type: CreateUploadDto,
    required: true,
  })
  @Post('/uploadImage')
  // 使用名称为 'file' 的字段来接收上传的文件
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../..', 'public/images/market'),
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    // @Body('userId') userId,
  ) {
    const data = await this.marketService.uploadFile(file.filename);
    return data;
  }
}
