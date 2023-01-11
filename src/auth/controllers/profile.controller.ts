import {
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../user/entities/user.entity';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { CustomBody } from '../../common/decorators/custom-body.decorator';
import { customDecoratorsValidationOptions } from '../../config/validation.config';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ProfileService } from '../services/profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  show(@CurrentUser() user: User) {
    return {
      message: 'Get user profile',
      data: user,
    };
  }

  @Patch()
  async update(
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return {
      message: 'Profile updated successfully',
      data: await this.profileService.update(user, updateProfileDto),
    };
  }

  @Patch('password')
  async password(
    @CurrentUser() user: User,
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    changePasswordDto: ChangePasswordDto,
  ) {
    await this.profileService.changePassword(user, changePasswordDto);

    return {
      message: 'Password updated successfully',
    };
  }
}
