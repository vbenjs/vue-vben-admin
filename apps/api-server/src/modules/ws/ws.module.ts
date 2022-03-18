import { Module } from '@nestjs/common'
import { WsStartGateway } from './ws.gateway'

@Module({
  providers: [WsStartGateway],
  exports: [WsStartGateway],
})
export class WsModule {}
