import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUnique } from 'src/common/validators/unique.validator';
import { Invite } from '../entities/invite.entity';
import { User } from '../entities/user.entity';

export class SendInviteDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUnique({ entity: Invite })
  @IsUnique({ entity: User })
  email: string;
}
