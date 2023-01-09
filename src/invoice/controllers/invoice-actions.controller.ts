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
import { Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { MarkAsPaidDto } from '../dto/mark-as-paid.dto';

@Controller('invoices/:invoice')
export class InvoiceActionsController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('send')
  async send(@Param('invoice') invoice: string, @Res() res: Response) {
    await this.invoiceService.send(invoice);

    return res.json({
      message: 'Sending invoice... We will notify you if it is successful...',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('mark-as-paid')
  async markAsPaid(
    @Param('invoice') invoice: string,
    @Body() markAsPaidDto: MarkAsPaidDto,
    @Res() res: Response,
  ) {
    await this.invoiceService.markAsPaid(invoice, markAsPaidDto);

    return res.json({
      message: 'Invoice marked as paid successfully...',
    });
  }
}
