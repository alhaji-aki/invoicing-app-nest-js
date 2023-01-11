import { ValidationPipeOptions } from '@nestjs/common';

export const generalValidationOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  // TODO: figure this out
  // exceptionFactory: (errors: ValidationError[]) => {
  //   const errMsg = {};
  //   errors.forEach((err) => {
  //     errMsg[err.property] = [...Object.values(err.constraints)];
  //   });
  //   return new ValidationException(errMsg);
  // },
};

export const customDecoratorsValidationOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  validateCustomDecorators: true,
  transformOptions: {
    enableImplicitConversion: true,
    strategy: 'exposeAll',
  },
};
