import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { MarkAsPaidDto } from '../dto/mark-as-paid.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('invoices/:invoice')
@UseGuards(JwtAuthGuard)
export class InvoiceActionsController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('send')
  async send(@CurrentUser() user: User, @Param('invoice') invoice: string) {
    await this.invoiceService.send(user, invoice);

    return {
      message: 'Sending invoice... We will notify you if it is successful...',
    };
  }

  @Get('download-pdf')
  async downloadPdf(
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @Res() res: Response,
  ) {
    const results = await this.invoiceService.downloadPDF(user, invoice);

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
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @Body() markAsPaidDto: MarkAsPaidDto,
  ) {
    await this.invoiceService.markAsPaid(user, invoice, markAsPaidDto);

    return {
      message: 'Invoice marked as paid successfully...',
    };
  }
}
