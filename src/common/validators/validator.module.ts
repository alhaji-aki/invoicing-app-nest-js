import { Module } from '@nestjs/common';
import { UniqueValidator } from './unique.validator';
import { ExistsValidator } from './exists.validator';

@Module({
  providers: [UniqueValidator, ExistsValidator],
})
export class ValidatorModule {}
