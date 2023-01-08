import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

@Controller('invoices/:invoice/send')
export class SendInvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async send(@Param('invoice') invoice: string, @Res() res: Response) {
    await this.invoiceService.send(invoice);

    return res.json({
      message: 'Sending invoice... We will notify you if it is successful...',
    });
  }
}
