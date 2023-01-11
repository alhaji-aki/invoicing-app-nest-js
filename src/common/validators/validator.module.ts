import { Module } from '@nestjs/common';
import { UniqueValidator } from './unique.validator';
import { ExistsValidator } from './exists.validator';
import { CurrentPasswordValidator } from './current-password.validator';
import { MatchValidator } from './match.validator';

@Module({
  providers: [
    UniqueValidator,
    ExistsValidator,
    CurrentPasswordValidator,
    MatchValidator,
  ],
})
export class ValidatorModule {}
