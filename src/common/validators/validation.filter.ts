import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: any) {
    super();
  }
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: 'There were some invalid data in your request.',
      errors: exception.validationErrors,
    });
  }
}
