import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { SenderService } from '../services/sender.service';
import { CreateSenderDto } from '../dtos/create-sender.dto';
import { UpdateSenderDto } from '../dtos/update-sender.dto';
import { Response } from 'express';
import { ParamBody } from 'src/common/decorators/param-body.decorator';
import validationConfig from 'src/config/validation.config';

@Controller('companies/senders')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Get()
  async index(@Res() res: Response) {
    return res.json({
      message: 'Get senders.',
      data: await this.senderService.index(),
    });
  }

  @Post()
  async store(@Body() createSenderDto: CreateSenderDto, @Res() res: Response) {
    return res.json({
      message: 'Sender created successfully.',
      data: await this.senderService.store(createSenderDto),
    });
  }

  @Get(':sender')
  async show(@Param('sender') sender: string, @Res() res: Response) {
    return res.json({
      message: 'Get sender.',
      data: await this.senderService.show(sender),
    });
  }

  @Patch(':sender')
  async update(
    @Param('sender') sender: string,
    @ParamBody(
      new ValidationPipe({
        validateCustomDecorators: true,
        ...validationConfig,
      }),
    )
    updateSenderDto: UpdateSenderDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Sender updated successfully.',
      data: await this.senderService.update(sender, updateSenderDto),
    });
  }

  @Delete(':sender')
  async delete(@Param('sender') sender: string, @Res() res: Response) {
    return res.json({
      message: 'Sender deleted successfully.',
      data: await this.senderService.delete(sender),
    });
  }
}
