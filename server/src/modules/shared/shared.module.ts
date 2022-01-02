import { Module } from '@nestjs/common'
import { ConfigModule } from './config.module'
import { ThrottleModule } from './throttler.module'

@Module({
  imports: [ConfigModule, ThrottleModule],
})
export class SharedModule {}
