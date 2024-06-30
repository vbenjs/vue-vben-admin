import type { AppConfig } from '@/types';

import process from 'node:process';

import { HttpExceptionFilter } from '@/core/filter';
import { TransformInterceptor } from '@/core/interceptor';
import { ParamsValidationPipe } from '@/core/pipe';
import { type LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './core/guard';

async function bootstrap() {
  const debug: LogLevel[] = process.env.DEBUG ? ['debug'] : [];
  const loggerLevel: LogLevel[] = ['log', 'error', 'warn', ...debug];

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: loggerLevel,
  });

  // 获取 ConfigService 实例
  const configService = app.get(ConfigService);

  // 使用 ConfigService 获取配置值
  const port = configService.get<AppConfig['port']>('port') || 3000;
  const apiPrefix = configService.get<AppConfig['apiPrefix']>('apiPrefix');

  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 设置全局接口数据校验
  app.useGlobalPipes(new ParamsValidationPipe());

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);

  console.log(
    `Application is running on: http://localhost:${port}${apiPrefix}`,
  );
}
bootstrap();
