import { registerAs } from '@nestjs/config'

function truthy(value?: string) {
  return value === 'true'
}

export default registerAs('app', () => {
  const {
    APP_PORT,
    APP_NAME,
    APP_LOGGER_PATH,
    SWAGGER_ENABLE,
    LOGGER_OUTPUT_ENABLE,
    THROTTLE_LIMIT,
    THROTTLE_TTL,

    SWAGGER_URL,
    SWAGGER_TITLE,
    SWAGGER_DESC,
    SWAGGER_VERSION,
    JWT_SECRET,
    JWT_EXPIRATION,
  } = process.env

  return {
    port: parseInt(APP_PORT!, 10) || 3000,
    name: APP_NAME || 'app',
    loggerPath: APP_LOGGER_PATH,
    enableLoggerOutput: truthy(LOGGER_OUTPUT_ENABLE),

    throttleLimit: parseInt(THROTTLE_LIMIT!, 10) || 60,
    throttleTtl: parseInt(THROTTLE_TTL!, 10) || 60,

    swaggerEnable: truthy(SWAGGER_ENABLE),
    swaggerUrl: SWAGGER_URL,
    swaggerTitle: SWAGGER_TITLE,
    swaggerDesc: SWAGGER_DESC,
    swaggerVersion: SWAGGER_VERSION,

    jwtSecret: JWT_SECRET,
    jwtExpiration: JWT_EXPIRATION,
  }
})
