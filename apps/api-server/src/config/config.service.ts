import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get appConfig() {
    return this.configService.get('app')
  }

  get appPort(): number {
    return this.appConfig.port
  }

  get appName(): string {
    return this.appConfig.name
  }

  get loggerPath(): string {
    return this.appConfig.loggerPath
  }

  get enableLoggerOutput(): string {
    return this.appConfig.enableLoggerOutput
  }

  get throttleLimit(): number {
    return this.appConfig.throttleLimit
  }

  get throttleTtl(): number {
    return this.appConfig.throttleTtl
  }

  get swaggerEnable(): string {
    return this.appConfig.swaggerEnable
  }

  get swaggerUrl(): string {
    return this.appConfig.swaggerUrl
  }

  get swaggerTitle(): string {
    return this.appConfig.swaggerTitle
  }

  get swaggerDesc(): string {
    return this.appConfig.swaggerDesc
  }

  get swaggerVersion(): string {
    return this.appConfig.swaggerVersion
  }

  get jwtSecret(): string {
    return this.appConfig.jwtSecret
  }

  get jwtExpiration(): string {
    return this.appConfig.jwtExpiration
  }
}
