import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;

    const [entity, field = args.property] = args.constraints;

    const where = { [field]: value };

    return await this.dataSource.getRepository(entity).exist({ where });
  }

  defaultMessage(args: ValidationArguments) {
    let [entity] = args.constraints;

    entity = entity.name;
    return `${entity} selected does not exist.`;
  }
}

export function IsExists(
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity: Function,
  field?: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'exists',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: ExistsValidator,
    });
  };
}
