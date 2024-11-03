import type { Response as ExpressResponse } from 'express';

import { All, Controller, Query, Response } from '@nestjs/common';

import { Public } from '#/guards';
import { SkipResCheck } from '#/interfaces/response';

@Controller()
export class UserController {
  @All()
  @Public()
  @SkipResCheck()
  public index() {
    return `
<h1>Hello Vben Admin</h1>
<h2>Mock service is starting</h2>
<ul>
<li><a href="/user">/user/info</a></li>
<li><a href="/menu">/menu/all</a></li>
<li><a href="/auth/codes">/auth/codes</a></li>
<li><a href="/auth/login">/auth/login</a></li>
</ul>
`;
  }

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
