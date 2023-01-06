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
import { RecipientService } from '../services/recipient.service';
import { CreateRecipientDto } from '../dtos/create-recipient.dto';
import { UpdateRecipientDto } from '../dtos/update-recipient.dto';
import { Response } from 'express';
import { ParamBody } from 'src/common/decorators/param-body.decorator';
import validationConfig from 'src/config/validation.config';

@Controller('companies/recipients')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Get()
  async index(@Res() res: Response) {
    return res.json({
      message: 'Get recipients.',
      data: await this.recipientService.index(),
    });
  }

  @Post()
  async store(
    @Body() createRecipientDto: CreateRecipientDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Recipient created successfully.',
      data: await this.recipientService.store(createRecipientDto),
    });
  }

  @Get(':recipient')
  async show(@Param('recipient') recipient: string, @Res() res: Response) {
    return res.json({
      message: 'Get recipient.',
      data: await this.recipientService.show(recipient),
    });
  }

  @Patch(':recipient')
  async update(
    @Param('recipient') recipient: string,
    @ParamBody(
      new ValidationPipe({
        validateCustomDecorators: true,
        ...validationConfig,
      }),
    )
    updateRecipientDto: UpdateRecipientDto,
    @Res() res: Response,
  ) {
    return res.json({
      message: 'Recipient updated successfully.',
      data: await this.recipientService.update(recipient, updateRecipientDto),
    });
  }

  @Delete(':recipient')
  async delete(@Param('recipient') recipient: string, @Res() res: Response) {
    return res.json({
      message: 'Recipient deleted successfully.',
      data: await this.recipientService.delete(recipient),
    });
  }
}
