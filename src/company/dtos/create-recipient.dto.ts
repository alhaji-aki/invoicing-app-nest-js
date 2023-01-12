import { IsNotEmpty, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Recipient } from '../entities/recipient.entity';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateRecipientDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({
    entity: Recipient,
    extraConditions: (o: CreateRecipientDto) => ({ userId: o.authUser.id }),
  })
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsNotEmpty()
  @MaxLength(255)
  country: string;

  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @IsNotEmpty()
  @MaxLength(255)
  zipCode: string;

  @IsNotEmpty()
  @MaxLength(255)
  contactName: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  contactEmail: string;

  @IsOptional({ each: true })
  @MaxLength(255, { each: true })
  @IsEmail({}, { each: true })
  ccEmails: string[];
}
