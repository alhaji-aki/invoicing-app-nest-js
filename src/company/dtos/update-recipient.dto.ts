import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecipientDto } from './create-recipient.dto';
import { IsOptional, MaxLength, Allow } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Recipient } from '../entities/recipient.entity';

export class UpdateRecipientDto extends PartialType(
  OmitType(CreateRecipientDto, ['name'] as const),
) {
  @Allow()
  recipient: string;

  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Recipient,
    ignoreValue: (o) => o.recipient,
    ignoreColumn: 'uuid',
  })
  name: string;
}
