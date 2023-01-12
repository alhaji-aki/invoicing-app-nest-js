import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { IsUnique } from '../../common/validators/unique.validator';
import { Sender } from '../entities/sender.entity';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateSenderDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique({
    entity: Sender,
    extraConditions: (o: CreateSenderDto) => ({ userId: o.authUser.id }),
  })
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
