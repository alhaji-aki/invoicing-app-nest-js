import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { CurrentPassword } from 'src/common/validators/current-password.validator';
import { Match } from 'src/common/validators/match.validator';

export class ChangePasswordDto extends BaseDto {
  @IsNotEmpty()
  @CurrentPassword()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
