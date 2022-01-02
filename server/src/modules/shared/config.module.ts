import { Module, Global } from '@nestjs/common'
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config'
import { ENV } from '../../utils/env'
import { ConfigService } from '../../config/config.service'
import appConfiguration from '../../config/app'
import Joi from '@hapi/joi'

const isBoolean = Joi.string().valid('true', 'false')

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: [`.env.${ENV}.local`, `.env.${ENV}`, '.env.local', '.env'],
      load: [appConfiguration],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        APP_NAME: Joi.string(),
        SWAGGER_ENABLE: isBoolean.default('false'),
        APP_RATE_LIMIT: isBoolean,
        APP_LOG_OUT_ENABLE: isBoolean,
      }),
    }),
  ],
  providers: [NestConfigService, ConfigService],
  exports: [NestConfigService, ConfigService],
})
export class ConfigModule {}
