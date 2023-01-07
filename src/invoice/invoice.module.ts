import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Recipient } from '../company/entities/recipient.entity';
import { Sender } from '../company/entities/sender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Recipient, Sender])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
