import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { RecipientService } from '../services/recipient.service';
import { CreateRecipientDto } from '../dtos/create-recipient.dto';
import { UpdateRecipientDto } from '../dtos/update-recipient.dto';
import { ParamBody } from '../../common/decorators/param-body.decorator';
import { customDecoratorsValidationOptions } from '../../config/validation.config';

@Controller('companies/recipients')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Get()
  async index() {
    return {
      message: 'Get recipients.',
      data: await this.recipientService.index(),
    };
  }

  @Post()
  async store(@Body() createRecipientDto: CreateRecipientDto) {
    return {
      message: 'Recipient created successfully.',
      data: await this.recipientService.store(createRecipientDto),
    };
  }

  @Get(':recipient')
  async show(@Param('recipient') recipient: string) {
    return {
      message: 'Get recipient.',
      data: await this.recipientService.show(recipient),
    };
  }

  @Patch(':recipient')
  async update(
    @Param('recipient') recipient: string,
    @ParamBody(new ValidationPipe(customDecoratorsValidationOptions))
    updateRecipientDto: UpdateRecipientDto,
  ) {
    return {
      message: 'Recipient updated successfully.',
      data: await this.recipientService.update(recipient, updateRecipientDto),
    };
  }

  @Delete(':recipient')
  async delete(@Param('recipient') recipient: string) {
    return {
      message: 'Recipient deleted successfully.',
      data: await this.recipientService.delete(recipient),
    };
  }
}
