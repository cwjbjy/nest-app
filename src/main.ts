import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/core/filter/any-exception.filter';
import { HttpExceptionFilter } from 'src/core/filter/http-exception.filter';
import { GlobalInterceptor } from 'src/core/interceptor/global.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  // 设置 api 访问前缀
  const prefix = config.get<string>('app.prefix');
  // 设置全局路由前缀
  app.setGlobalPrefix(prefix);
  // 注册全局拦截器
  app.useGlobalInterceptors(new GlobalInterceptor());

  //全局注册自定义管道
  app.useGlobalPipes(new ValidationPipe());

  // 注册全局错误的过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest-Admin')
    .setDescription('Nest-Admin 接口文档')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${prefix}/swagger-ui`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest-Admin API Docs',
  });

  //服务端口
  const port = config.get<number>('app.port') || 9000;
  await app.listen(port);
}
bootstrap();
