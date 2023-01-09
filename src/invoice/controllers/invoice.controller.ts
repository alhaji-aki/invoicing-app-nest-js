import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async index() {
    return {
      message: 'Get invoices.',
      data: await this.invoiceService.index(),
    };
  }

  @Post()
  async store(@Body() createInvoiceDto: CreateInvoiceDto) {
    return {
      message: 'Invoice created successfully.',
      data: await this.invoiceService.store(createInvoiceDto),
    };
  }

  @Get(':invoice')
  async show(@Param('invoice') invoice: string) {
    return {
      message: 'Get invoice.',
      data: await this.invoiceService.show(invoice),
    };
  }

  @Patch(':invoice')
  async update(
    @Param('invoice') invoice: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return {
      message: 'Invoice updated successfully.',
      data: await this.invoiceService.update(invoice, updateInvoiceDto),
    };
  }

  @Delete(':invoice')
  async delete(@Param('invoice') invoice: string) {
    return {
      message: 'Invoice deleted successfully.',
      data: await this.invoiceService.delete(invoice),
    };
  }
}
