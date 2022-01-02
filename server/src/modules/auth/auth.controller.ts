import { Controller, Post, Get } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    return await this.authService.login()
  }

  @Get('getUserInfoById')
  async getUserInfoById() {
    return await this.authService.getUserInfoById()
  }
}
