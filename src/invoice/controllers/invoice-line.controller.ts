import { Controller, Delete, Patch, Post, Body, Param } from '@nestjs/common';

import { CreateInvoiceLineDto } from '../dto/create-invoice-line.dto';
import { InvoiceLineService } from '../services/invoice-line.service';
import { UpdateInvoiceLineDto } from '../dto/update-invoice-line.dto';

@Controller('invoices/:invoice/invoice-lines')
export class InvoiceLineController {
  constructor(private readonly invoiceLineService: InvoiceLineService) {}

  @Post()
  async store(
    @Param('invoice') invoice: string,
    @Body() createInvoiceLineDto: CreateInvoiceLineDto,
  ) {
    return {
      message: 'Invoice line created successfully.',
      data: await this.invoiceLineService.store(invoice, createInvoiceLineDto),
    };
  }

  @Patch(':invoiceLine')
  async update(
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
    @Body() updateInvoiceLineDto: UpdateInvoiceLineDto,
  ) {
    return {
      message: 'Invoice line updated successfully.',
      data: await this.invoiceLineService.update(
        invoice,
        invoiceLine,
        updateInvoiceLineDto,
      ),
    };
  }

  @Delete(':invoiceLine')
  async delete(
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
  ) {
    return {
      message: 'Invoice line deleted successfully.',
      data: await this.invoiceLineService.delete(invoice, invoiceLine),
    };
  }
}
