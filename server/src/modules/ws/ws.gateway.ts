import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'

@WebSocketGateway(3300)
export class WsStartGateway {
  @SubscribeMessage('test')
  hello(@MessageBody() data: any) {
    return {
      id: Math.ceil(Math.random() * 1000),
      time: new Date().getTime(),
      res: `serve: ${data}`,
    }
  }
}
