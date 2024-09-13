import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}
  async get(key) {
    let value = await this.redisClient.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    return value;
  }
  async set(key: string, value: any, second?: number) {
    value = JSON.stringify(value);
    return await this.redisClient.set(key, value, { EX: second });
  }
  async del(key: string) {
    return await this.redisClient.del(key);
  }
  //清空所有数据库中的所有键
  async flushAll() {
    return await this.redisClient.flushAll();
  }
}
