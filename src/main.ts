import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ValidationExceptionFilter } from './common/validators/validation.filter';
import validationConfig from './config/validation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.useGlobalPipes(new ValidationPipe(validationConfig));

  await app.listen(3000);
}
bootstrap();
