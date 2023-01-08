import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceLineDto } from './create-invoice-line.dto';

export class UpdateInvoiceLineDto extends PartialType(CreateInvoiceLineDto) {}
