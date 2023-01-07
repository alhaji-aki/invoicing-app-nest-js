import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Response } from 'express';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async index(@Res() res: Response) {
    return res.json({
      message: 'Get invoices.',
      data: await this.invoiceService.index(),
    });
  }

  @Post()
  async store(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Invoice created successfully.',
      data: await this.invoiceService.store(createInvoiceDto),
    });
  }

  @Get(':invoice')
  async show(@Param('invoice') invoice: string, @Res() res: Response) {
    return res.json({
      message: 'Get invoice.',
      data: await this.invoiceService.show(invoice),
    });
  }

  @Patch(':invoice')
  async update(
    @Param('invoice') invoice: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Invoice updated successfully.',
      data: await this.invoiceService.update(invoice, updateInvoiceDto),
    });
  }

  @Delete(':invoice')
  async delete(@Param('invoice') invoice: string, @Res() res: Response) {
    return res.json({
      message: 'Invoice deleted successfully.',
      data: await this.invoiceService.delete(invoice),
    });
  }
}
