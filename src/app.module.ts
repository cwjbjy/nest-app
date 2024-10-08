import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from 'src/config';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { RedisCacheModule } from 'src/core/redis-cache/redis-cache.module';

import { AuthModule } from './module/auth/auth.module';
import { ChatModule } from './module/chat/chat.module';
import { TestModule } from './module/test/test.module';
import { TrackModule } from './module/track/track.module';
import { UserModule } from './module/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, //缓存
      load: [configuration], //加载配置文件
      isGlobal: true, //设置为全局
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static', //不添加，只能读取html文件
    }),
    AuthModule,
    UserModule,
    TestModule,
    TrackModule,
    ChatModule,
    RedisCacheModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
