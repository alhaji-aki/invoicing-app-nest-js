import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Recipient } from '../company/entities/recipient.entity';
import { Sender } from '../company/entities/sender.entity';
import { InvoiceLine } from './entities/invoice-line.entity';
import { InvoiceLineService } from './services/invoice-line.service';
import { InvoiceLineController } from './controllers/invoice-line.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Recipient, Sender, InvoiceLine]),
  ],
  controllers: [InvoiceController, InvoiceLineController],
  providers: [InvoiceService, InvoiceLineService],
})
export class InvoiceModule {}
