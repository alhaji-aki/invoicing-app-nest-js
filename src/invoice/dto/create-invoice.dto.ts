import {
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  MaxLength,
} from 'class-validator';
import { IsExists } from '../../common/validators/exists.validator';
import { Sender } from '../../company/entities/sender.entity';
import { Recipient } from '../../company/entities/recipient.entity';
import { CreateInvoiceLineDto } from './create-invoice-line.dto';
import { Type } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateInvoiceDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsUUID('4')
  @IsExists({
    entity: Sender,
    column: 'uuid',
    extraConditions: (o: CreateInvoiceDto) => ({ userId: o.authUser.id }),
  })
  sender: string;

  @IsNotEmpty()
  @IsUUID('4')
  @IsExists({
    entity: Recipient,
    column: 'uuid',
    extraConditions: (o: CreateInvoiceDto) => ({ userId: o.authUser.id }),
  })
  recipient: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateInvoiceLineDto)
  invoiceLines: CreateInvoiceLineDto[];
}
