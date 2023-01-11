import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSenderDto } from './create-sender.dto';
import { IsOptional, MaxLength, Allow } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Sender } from '../entities/sender.entity';

export class UpdateSenderDto extends PartialType(
  OmitType(CreateSenderDto, ['name'] as const),
) {
  @Allow()
  sender: string;

  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Sender,
    ignoreValue: (o) => o.sender,
    ignoreColumn: 'uuid',
  })
  name: string;
}
