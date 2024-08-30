import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from 'src/core/config';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

import { AuthModule } from './module/auth/auth.module';
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
