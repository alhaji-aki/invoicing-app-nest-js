import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';

@ValidatorConstraint({ name: 'current-password', async: true })
@Injectable()
export class CurrentPasswordValidator implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    const user: User = args.object['authUser'];

    return await bcrypt.compare(value, user.password);
  }

  defaultMessage() {
    return `The password submitted does not match the user's current password.`;
  }
}

export function CurrentPassword(
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'current-password',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CurrentPasswordValidator,
    });
  };
}
