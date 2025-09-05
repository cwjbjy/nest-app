import { Controller, Post, Body, Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { AiService } from './ai.service';

@Controller('chat')
export class AiController {
  constructor(private readonly deepSeekService: AiService) {}

  @Post('stream')
  @Sse() // 使用Server-Sent Events装饰器
  async streamChatCompletion(
    @Body() body: { messages: any[] },
  ): Promise<Observable<any>> {
    try {
      const { messages } = body;
      // 获取内容流并转换为SSE格式的Observable
      return (await this.deepSeekService.createChatCompletion(messages)).pipe(
        map((chunk) => ({
          data: { content: chunk },
        })),
      );
    } catch (error) {
      console.error('Error creating stream:', error);
      // 抛出异常，让全局异常过滤器处理
      throw error;
    }
  }
}
