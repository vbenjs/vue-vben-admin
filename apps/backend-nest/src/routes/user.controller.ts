import { All, Controller, Request } from '@nestjs/common';

@Controller('user')
export class UserController {
  @All('info')
  public codes(@Request() req: Express.Request) {
    return req.user as Express.User;
  }
}

export default UserController;
