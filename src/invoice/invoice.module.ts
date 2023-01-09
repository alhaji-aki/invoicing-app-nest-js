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
import { InvoiceActionsController } from './controllers/invoice-actions.controller';
import { BullModule } from '@nestjs/bull';
import { SendInvoiceConsumer } from './consumers/send-invoice.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Recipient, Sender, InvoiceLine]),
    BullModule.registerQueue({
      name: 'invoices',
    }),
  ],
  controllers: [
    InvoiceController,
    InvoiceLineController,
    InvoiceActionsController,
  ],
  providers: [InvoiceService, InvoiceLineService, SendInvoiceConsumer],
})
export class InvoiceModule {}
