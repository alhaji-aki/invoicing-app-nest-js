import {
  Controller,
  Delete,
  Patch,
  Post,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Invoice line created successfully.',
      data: await this.invoiceLineService.store(invoice, createInvoiceLineDto),
    });
  }

  @Patch(':invoiceLine')
  async update(
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
    @Body() updateInvoiceLineDto: UpdateInvoiceLineDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Invoice line updated successfully.',
      data: await this.invoiceLineService.update(
        invoice,
        invoiceLine,
        updateInvoiceLineDto,
      ),
    });
  }

  @Delete(':invoiceLine')
  async delete(
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Invoice line deleted successfully.',
      data: await this.invoiceLineService.delete(invoice, invoiceLine),
    });
  }
}
