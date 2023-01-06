import { Module } from '@nestjs/common';
import { UniqueValidator } from './unique.validator';

@Module({
  providers: [UniqueValidator],
})
export class ValidatorModule {}
