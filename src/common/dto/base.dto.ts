import { Allow } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class BaseDto {
  @Allow()
  authUser?: User;

  @Allow()
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity?: Function;
}
