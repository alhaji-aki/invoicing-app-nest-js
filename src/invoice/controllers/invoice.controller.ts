import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CustomBody } from 'src/common/decorators/custom-body.decorator';
import { customDecoratorsValidationOptions } from 'src/config/validation.config';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    return {
      message: 'Get invoices.',
      data: await this.invoiceService.index(user),
    };
  }

  @Post()
  async store(
    @CurrentUser() user: User,
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    createInvoiceDto: CreateInvoiceDto,
  ) {
    return {
      message: 'Invoice created successfully.',
      data: await this.invoiceService.store(user, createInvoiceDto),
    };
  }

  @Get(':invoice')
  async show(@CurrentUser() user: User, @Param('invoice') invoice: string) {
    return {
      message: 'Get invoice.',
      data: await this.invoiceService.show(user, invoice),
    };
  }

  @Patch(':invoice')
  async update(
    @CurrentUser() user: User,
    @Param('invoice') invoice: string,
    @CustomBody(
      'invoice',
      new ValidationPipe(customDecoratorsValidationOptions),
    )
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return {
      message: 'Invoice updated successfully.',
      data: await this.invoiceService.update(user, invoice, updateInvoiceDto),
    };
  }

  @Delete(':invoice')
  async delete(@CurrentUser() user: User, @Param('invoice') invoice: string) {
    return {
      message: 'Invoice deleted successfully.',
      data: await this.invoiceService.delete(user, invoice),
    };
  }
}
