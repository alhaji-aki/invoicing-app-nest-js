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
import { SenderService } from '../services/sender.service';
import { CreateSenderDto } from '../dtos/create-sender.dto';
import { UpdateSenderDto } from '../dtos/update-sender.dto';
import { ParamBody } from '../../common/decorators/param-body.decorator';
import { customDecoratorsValidationOptions } from '../../config/validation.config';

@Controller('companies/senders')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Get()
  async index() {
    return {
      message: 'Get senders.',
      data: await this.senderService.index(),
    };
  }

  @Post()
  async store(@Body() createSenderDto: CreateSenderDto) {
    return {
      message: 'Sender created successfully.',
      data: await this.senderService.store(createSenderDto),
    };
  }

  @Get(':sender')
  async show(@Param('sender') sender: string) {
    return {
      message: 'Get sender.',
      data: await this.senderService.show(sender),
    };
  }

  @Patch(':sender')
  async update(
    @Param('sender') sender: string,
    @ParamBody(new ValidationPipe(customDecoratorsValidationOptions))
    updateSenderDto: UpdateSenderDto,
  ) {
    return {
      message: 'Sender updated successfully.',
      data: await this.senderService.update(sender, updateSenderDto),
    };
  }

  @Delete(':sender')
  async delete(@Param('sender') sender: string) {
    return {
      message: 'Sender deleted successfully.',
      data: await this.senderService.delete(sender),
    };
  }
}
