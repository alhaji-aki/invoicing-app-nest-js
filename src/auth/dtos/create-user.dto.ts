import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../common/validators/match.validator';
import { IsUnique } from 'src/common/validators/unique.validator';
import { User } from 'src/user/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @IsUnique({ entity: User })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
