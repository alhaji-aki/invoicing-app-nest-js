import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InviteService } from '../services/invite.service';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendInviteDto } from '../dtos/send-invite.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('invites')
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get()
  async index() {
    return {
      message: 'Get invites',
      data: await this.inviteService.index(),
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async store(@CurrentUser() user: User, @Body() sendInviteDto: SendInviteDto) {
    await this.inviteService.store(user, sendInviteDto);

    return {
      message: 'Invite sent successfully',
    };
  }

  @Delete(':invite')
  async delete(@Param('invite') invite: string) {
    await this.inviteService.delete(invite);

    return {
      message: 'Invite revoked successfully',
    };
  }

  @Post(':invite')
  async resend(@CurrentUser() user: User, @Param('invite') invite: string) {
    await this.inviteService.resend(user, invite);

    return {
      message: 'Invite resent successfully',
    };
  }
}
