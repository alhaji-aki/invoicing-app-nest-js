export default {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
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
