import { Controller, Get } from '@nestjs/common'

@Controller()
export class IndexController {
  constructor() {}

  @Get('/')
  async index() {
    return 'Hello World!'
  }
}
