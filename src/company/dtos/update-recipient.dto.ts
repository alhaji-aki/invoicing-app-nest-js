import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecipientDto } from './create-recipient.dto';
import { IsOptional, MaxLength } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Recipient } from '../entities/recipient.entity';

export class UpdateRecipientDto extends PartialType(
  OmitType(CreateRecipientDto, ['name'] as const),
) {
  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Recipient,
    ignoreValue: (o: UpdateRecipientDto) => o.entity,
    ignoreColumn: 'uuid',
    extraConditions: (o: UpdateRecipientDto) => ({ userId: o.authUser.id }),
  })
  name: string;
}
