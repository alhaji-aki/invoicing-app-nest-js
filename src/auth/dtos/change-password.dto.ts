import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';
import { CurrentPassword } from '../../common/validators/current-password.validator';
import { Match } from '../../common/validators/match.validator';

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
