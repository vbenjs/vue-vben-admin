import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
  type ValidationPipeOptions,
} from '@nestjs/common';

class ParamsValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) => {
        const message = Object.values(errors[0].constraints)[0];
        return new BadRequestException({
          message,
          status: HttpStatus.BAD_REQUEST,
        });
      },
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      ...options,
    });
  }
}

export { ParamsValidationPipe };
