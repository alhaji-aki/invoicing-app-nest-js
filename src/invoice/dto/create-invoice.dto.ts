import {
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { IsExists } from '../../common/validators/exists.validator';
import { Sender } from '../../company/entities/sender.entity';
import { Recipient } from '../../company/entities/recipient.entity';
import { CreateInvoiceLineDto } from './create-invoice-line.dto';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsUUID('4')
  @IsExists(Sender, 'uuid')
  sender: string;

  @IsNotEmpty()
  @IsUUID('4')
  @IsExists(Recipient, 'uuid')
  recipient: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateInvoiceLineDto)
  invoiceLines: CreateInvoiceLineDto[];
}
