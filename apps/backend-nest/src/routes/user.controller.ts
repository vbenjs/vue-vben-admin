import { All, Controller, Req } from '@nestjs/common';

@Controller('user')
export class UserController {
  @All('info')
  public codes(@Req() req: Express.Request) {
    return req.user as Express.User;
  }
}

export default UserController;
