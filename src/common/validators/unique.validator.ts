import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    const [entity, field = args.property] = args.constraints;

    return await this.dataSource
      .getRepository(entity)
      .exist({ where: { [field]: value } });
  }

  defaultMessage(args: ValidationArguments) {
    let [entity] = args.constraints;
    const field = args.constraints[1] || args.property;

    entity = entity.name;
    return `${entity} with the same '${field}' already exist`;
  }
}

export function IsUnique(
  entity: Function,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'unique',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: UniqueValidator,
    });
  };
}
