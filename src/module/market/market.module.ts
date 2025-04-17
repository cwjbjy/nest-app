import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Market, MarketSchema } from './entities/market.entity';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
