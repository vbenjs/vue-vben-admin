import type { Response } from 'express';

import { Controller, Get, Query, Res } from '@nestjs/common';

@Controller('mock')
export class MockController {
  /**
   * 用于模拟任意的状态码
   * @param res
   */
  @Get('status')
  async mockAnyStatus(
    @Res() res: Response,
    @Query() { status }: { status: string },
  ) {
    res.status(Number.parseInt(status, 10)).send({
      code: 1,
      data: null,
      error: null,
      message: `code is ${status}`,
    });
  }
}
