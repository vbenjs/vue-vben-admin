import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'
import helmet from 'helmet'
import compression from 'compression'
import { ConfigService } from './config/config.service'
import { createSwagger } from './plugins'
import { WsAdapter } from './modules/ws/ws.adapter'
import { TransformInterceptor } from './common/interceptor'
import { join } from 'path'
import { cyan } from 'chalk'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  )

  app.useWebSocketAdapter(new WsAdapter(app))

  app.enable('trust proxy')

  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.enableCors({
    origin: (origin, cb) => {
      cb(null, true)
    },
    credentials: true,
  })

  app.use(helmet())
  app.use(compression())

  const configService = app.get(ConfigService)
  const { appPort } = configService

  app.useGlobalInterceptors(new TransformInterceptor())

  const swaggerServer = createSwagger(app)

  await app.listen(appPort, () => {
    console.log(
      `Service has been started, access address：${cyan(
        `http://localhost:${appPort}`,
      )}`,
    )
    swaggerServer()
  })
}
bootstrap()
