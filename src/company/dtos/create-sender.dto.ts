import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Sender } from '../entities/sender.entity';

export class CreateSenderDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({ entity: Sender })
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @MaxLength(255)
  taxNumber: string;

  @IsOptional()
  @MaxLength(255)
  checksPayableTo: string;
}
