import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecipientDto } from './create-recipient.dto';
import { IsOptional, MaxLength, Allow } from 'class-validator';
import { IsUnique } from 'src/common/validators/unique.validator';
import { Recipient } from '../entities/recipient.entity';

export class UpdateRecipientDto extends PartialType(
  OmitType(CreateRecipientDto, ['name'] as const),
) {
  @Allow()
  recipient: string;

  @IsOptional()
  @MaxLength(255)
  @IsUnique(Recipient, 'name', 'recipient')
  name: string;
}
