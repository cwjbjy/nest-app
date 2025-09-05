import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError } from 'rxjs';
import configuration from 'src/config';

const { key } = configuration();

@Injectable()
export class AiService {
  // 用你的实际API密钥替换，建议使用环境变量
  private readonly apiKey = key.deepSeek.key;
  private readonly apiUrl = key.deepSeek.baseUrl;

  constructor(private readonly httpService: HttpService) {}

  async createChatCompletion(messages: any[]): Promise<Observable<string>> {
    const requestData = {
      model: 'deepseek-chat',
      messages,
      stream: true,
      temperature: 0.7,
    };

    try {
      // 直接返回一个 Observable<string>，而不是 Observable<Observable<string>>
      return new Observable<string>((subscriber) => {
        this.httpService
          .post(this.apiUrl, requestData, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            responseType: 'stream',
          })
          .pipe(
            catchError((error) => {
              const message = error.response?.data || error.message;
              console.error('DeepSeek API request failed:', message);
              subscriber.error(
                new HttpException(
                  `DeepSeek API request failed: ${message}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
              return []; // 返回空数组以完成 Observable
            }),
          )
          .subscribe({
            next: (axiosResponse: AxiosResponse) => {
              const stream = axiosResponse.data;
              let buffer = '';

              stream.on('data', (chunk: Buffer) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                      const data = JSON.parse(line.slice(6));
                      const content = data.choices[0]?.delta?.content;
                      if (content) {
                        subscriber.next(content);
                      }
                    } catch (e) {
                      // 忽略解析错误
                    }
                  }
                }
                buffer = lines[lines.length - 1];
              });

              stream.on('end', () => {
                subscriber.complete();
              });

              stream.on('error', (err) => {
                subscriber.error(err);
              });
            },
            error: (err) => {
              subscriber.error(err);
            },
          });
      });
    } catch (error) {
      throw new HttpException(
        'Failed to create chat completion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
