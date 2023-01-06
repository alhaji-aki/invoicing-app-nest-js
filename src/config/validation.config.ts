import { ValidationError } from '@nestjs/common';
import { ValidationException } from '../common/validators/validation.filter';

export default {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const errMsg = {};
    errors.forEach((err) => {
      errMsg[err.property] = [...Object.values(err.constraints)];
    });
    return new ValidationException(errMsg);
  },
};
