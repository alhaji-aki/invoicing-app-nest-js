import { IsNotEmpty, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Recipient } from '../entities/recipient.entity';

export class CreateRecipientDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique(Recipient)
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
  @IsEmail()
  contactEmail: string;

  @IsOptional({ each: true })
  @MaxLength(255, { each: true })
  @IsEmail({}, { each: true })
  ccEmails: string[];
}
