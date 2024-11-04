import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP请求');

  use(req: Request, _: Response, next: NextFunction) {
    const { method, originalUrl: url, body, query, ip } = req;

    // 记录日志
    this.logger.verbose(
      `[${method}] ${url} ${JSON.stringify({ body, query })} - ${ip}`,
    );

    next();
  }
}

// 默认导出，便于glob导入
export default LoggerMiddleware;
