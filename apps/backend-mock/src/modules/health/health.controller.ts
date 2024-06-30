import { Public } from '@/core/decorator';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Public()
  @Get()
  getHeart(): string {
    return 'ok';
  }
}
