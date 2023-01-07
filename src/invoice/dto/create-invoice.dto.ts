import { IsNotEmpty, IsUUID, ArrayNotEmpty } from 'class-validator';
import { IsExists } from '../../common/validators/exists.validator';
import { Sender } from '../../company/entities/sender.entity';
import { Recipient } from '../../company/entities/recipient.entity';
import { CreateInvoiceLineDto } from './create-invoice-line.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsUUID('4')
  @IsExists(Sender, 'uuid')
  sender: string;

  @IsNotEmpty()
  @IsUUID('4')
  @IsExists(Recipient, 'uuid')
  recipient: string;

  @ArrayNotEmpty()
  invoiceLines: CreateInvoiceLineDto[];
}
