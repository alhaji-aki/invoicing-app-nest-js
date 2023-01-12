import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SenderService } from '../services/sender.service';
import { CreateSenderDto } from '../dtos/create-sender.dto';
import { UpdateSenderDto } from '../dtos/update-sender.dto';
import { customDecoratorsValidationOptions } from '../../config/validation.config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CustomBody } from 'src/common/decorators/custom-body.decorator';

@Controller('companies/senders')
@UseGuards(JwtAuthGuard)
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    return {
      message: 'Get senders.',
      data: await this.senderService.index(user),
    };
  }

  @Post()
  async store(
    @CurrentUser() user: User,
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    createSenderDto: CreateSenderDto,
  ) {
    return {
      message: 'Sender created successfully.',
      data: await this.senderService.store(user, createSenderDto),
    };
  }

  @Get(':sender')
  async show(@CurrentUser() user: User, @Param('sender') sender: string) {
    return {
      message: 'Get sender.',
      data: await this.senderService.show(user, sender),
    };
  }

  @Patch(':sender')
  async update(
    @CurrentUser() user: User,
    @Param('sender') sender: string,
    @CustomBody('sender', new ValidationPipe(customDecoratorsValidationOptions))
    updateSenderDto: UpdateSenderDto,
  ) {
    return {
      message: 'Sender updated successfully.',
      data: await this.senderService.update(user, sender, updateSenderDto),
    };
  }

  @Delete(':sender')
  async delete(@CurrentUser() user: User, @Param('sender') sender: string) {
    return {
      message: 'Sender deleted successfully.',
      data: await this.senderService.delete(user, sender),
    };
  }
}
