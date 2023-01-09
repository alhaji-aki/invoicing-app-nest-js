import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

import { InvoiceService } from '../services/invoice.service';
import { MarkAsPaidDto } from '../dto/mark-as-paid.dto';
import { Response } from 'express';

@Controller('invoices/:invoice')
export class InvoiceActionsController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('send')
  async send(@Param('invoice') invoice: string) {
    await this.invoiceService.send(invoice);

    return {
      message: 'Sending invoice... We will notify you if it is successful...',
    };
  }

  @Get('download-pdf')
  async downloadPdf(@Param('invoice') invoice: string, @Res() res: Response) {
    const results = await this.invoiceService.downloadPDF(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${results.invoice.createdAt}.pdf"`,
      'Content-Length': results.buffer.length,
    });

    res.end(results.buffer);
  }

  @HttpCode(HttpStatus.OK)
  @Post('mark-as-paid')
  async markAsPaid(
    @Param('invoice') invoice: string,
    @Body() markAsPaidDto: MarkAsPaidDto,
  ) {
    await this.invoiceService.markAsPaid(invoice, markAsPaidDto);

    return {
      message: 'Invoice marked as paid successfully...',
    };
  }
}
