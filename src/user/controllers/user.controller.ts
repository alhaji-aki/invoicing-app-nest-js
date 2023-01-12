import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index() {
    return {
      message: 'Get users',
      data: await this.userService.index(),
    };
  }

  @Post(':user/toggle-admin')
  async toggleAdmin(
    @CurrentUser() authUser: User,
    @Param('user') user: string,
  ) {
    return {
      message: 'User admin role changed.',
      data: await this.userService.toggleAdmin(authUser, user),
    };
  }
}
