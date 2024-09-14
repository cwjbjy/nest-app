import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';

import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient();
        await client.connect();
        return client;
      },
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
