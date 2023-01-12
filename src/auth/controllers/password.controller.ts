import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Controller('auth')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.passwordService.sendResetToken(forgotPasswordDto);

    return {
      message: 'Password reset token sent successfully...',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.passwordService.reset(resetPasswordDto);

    return {
      message: 'Your password has been reset successfully...',
    };
  }
}
