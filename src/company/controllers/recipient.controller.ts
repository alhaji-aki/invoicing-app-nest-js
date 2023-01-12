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
import { RecipientService } from '../services/recipient.service';
import { CreateRecipientDto } from '../dtos/create-recipient.dto';
import { UpdateRecipientDto } from '../dtos/update-recipient.dto';
import { customDecoratorsValidationOptions } from '../../config/validation.config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CustomBody } from 'src/common/decorators/custom-body.decorator';

@Controller('companies/recipients')
@UseGuards(JwtAuthGuard)
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    return {
      message: 'Get recipients.',
      data: await this.recipientService.index(user),
    };
  }

  @Post()
  async store(
    @CurrentUser() user: User,
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    createRecipientDto: CreateRecipientDto,
  ) {
    return {
      message: 'Recipient created successfully.',
      data: await this.recipientService.store(user, createRecipientDto),
    };
  }

  @Get(':recipient')
  async show(@CurrentUser() user: User, @Param('recipient') recipient: string) {
    return {
      message: 'Get recipient.',
      data: await this.recipientService.show(user, recipient),
    };
  }

  @Patch(':recipient')
  async update(
    @CurrentUser() user: User,
    @Param('recipient') recipient: string,
    @CustomBody(
      'recipient',
      new ValidationPipe(customDecoratorsValidationOptions),
    )
    updateRecipientDto: UpdateRecipientDto,
  ) {
    return {
      message: 'Recipient updated successfully.',
      data: await this.recipientService.update(
        user,
        recipient,
        updateRecipientDto,
      ),
    };
  }

  @Delete(':recipient')
  async delete(
    @CurrentUser() user: User,
    @Param('recipient') recipient: string,
  ) {
    return {
      message: 'Recipient deleted successfully.',
      data: await this.recipientService.delete(user, recipient),
    };
  }
}
