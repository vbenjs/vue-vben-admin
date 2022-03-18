import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { SharedModule } from './modules/shared/shared.module'
import { AuthModule } from './modules/auth/auth.module'
import { IndexModule } from './modules/index/index.module'
import { FileModule } from './modules/file/file.module'
import { WsModule } from './modules/ws/ws.module'
import { AppExceptionFilter } from './common/filter'

@Module({
  imports: [
    IndexModule,
    WsModule,
    SharedModule,
    FileModule,
    AuthModule,
    WsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
