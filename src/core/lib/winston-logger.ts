import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    //时间戳
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    //将错误对象转换为字符串
    winston.format.errors({ stack: true }),
    //处理日志条目中的占位符 %s 和 %o
    winston.format.splat(),
    //将整个日志条目转换为 JSON 格式
    winston.format.json(),
  ),
  transports: [
    //错误日志会被写入logs/error.log文件中
    new winston.transports.DailyRotateFile({
      filename: '%DATE%.log',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m', //文件最大的大小
      maxFiles: '60d', //文件存储最长的时间，过期会被删除
    }),
  ],
});
