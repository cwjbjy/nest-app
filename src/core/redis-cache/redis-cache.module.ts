import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import configuration from 'src/config';

import { RedisCacheService } from './redis-cache.service';

const { redis } = configuration();

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: redis.host,
            port: redis.port,
          },
        });
        await client.connect();
        return client;
      },
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
