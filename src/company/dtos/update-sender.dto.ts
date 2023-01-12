import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSenderDto } from './create-sender.dto';
import { IsOptional, MaxLength } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Sender } from '../entities/sender.entity';

export class UpdateSenderDto extends PartialType(
  OmitType(CreateSenderDto, ['name'] as const),
) {
  @IsOptional()
  @MaxLength(255)
  @IsUnique({
    entity: Sender,
    ignoreValue: (o: UpdateSenderDto) => o.entity,
    ignoreColumn: 'uuid',
    extraConditions: (o: UpdateSenderDto) => ({ userId: o.authUser.id }),
  })
  name: string;
}
