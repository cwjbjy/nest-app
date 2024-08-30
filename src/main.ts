import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/core/filter/any-exception.filter';
import { HttpExceptionFilter } from 'src/core/filter/http-exception.filter';
import { GlobalInterceptor } from 'src/core/interceptor/global.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // 注册全局拦截器
  app.useGlobalInterceptors(new GlobalInterceptor());

  // 注册全局错误的过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(9000);
}
bootstrap();
