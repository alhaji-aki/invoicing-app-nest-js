import {
  Controller,
  Delete,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CreateInvoiceLineDto } from '../dto/create-invoice-line.dto';
import { InvoiceLineService } from '../services/invoice-line.service';
import { UpdateInvoiceLineDto } from '../dto/update-invoice-line.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('invoices/:invoice/invoice-lines')
@UseGuards(JwtAuthGuard)
export class InvoiceLineController {
  constructor(private readonly invoiceLineService: InvoiceLineService) {}

  @Post()
  async store(
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @Body() createInvoiceLineDto: CreateInvoiceLineDto,
  ) {
    return {
      message: 'Invoice line created successfully.',
      data: await this.invoiceLineService.store(
        user,
        invoice,
        createInvoiceLineDto,
      ),
    };
  }

  @Patch(':invoiceLine')
  async update(
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
    @Body() updateInvoiceLineDto: UpdateInvoiceLineDto,
  ) {
    return {
      message: 'Invoice line updated successfully.',
      data: await this.invoiceLineService.update(
        user,
        invoice,
        invoiceLine,
        updateInvoiceLineDto,
      ),
    };
  }

  @Delete(':invoiceLine')
  async delete(
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @Param('invoiceLine') invoiceLine: string,
  ) {
    return {
      message: 'Invoice line deleted successfully.',
      data: await this.invoiceLineService.delete(user, invoice, invoiceLine),
    };
  }
}
