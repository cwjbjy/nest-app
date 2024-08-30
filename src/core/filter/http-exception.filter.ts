import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { logger } from 'src/core/lib/winston-logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response 对象
    const request = ctx.getRequest(); // 获取请求上下文中的 request 对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const data = {
      data: {},
      message,
      code: -1,
      path: request.url,
    };

    //记录日志
    logger.error(data);

    // 使用底层平台express的response，设置返回的状态码， 发送错误信息
    response.status(status).json(data);
  }
}
