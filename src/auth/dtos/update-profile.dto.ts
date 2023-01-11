import { IsEmail, IsOptional, MaxLength } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';
import { IsUnique } from '../../common/validators/unique.validator';
import { User } from '../../user/entities/user.entity';

export class UpdateProfileDto extends BaseDto {
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @IsUnique({
    entity: User,
    ignoreValue: (o) => o.authUser.id,
  })
  email?: string;
}
