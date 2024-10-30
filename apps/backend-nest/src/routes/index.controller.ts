import type { Response as ExpressResponse } from 'express';

import { All, Controller, Query, Response } from '@nestjs/common';

@Controller()
export class UserController {
  @All('status')
  public status(
    @Response() res: ExpressResponse,
    @Query('status') status: string,
  ) {
    res.status(Number(status));
    return status;
  }
}

export default UserController;
