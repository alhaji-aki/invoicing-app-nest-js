import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, Not } from 'typeorm';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;

    const [entity, field = args.property, ignore = null] = args.constraints;

    const where =
      ignore && args.object[ignore]
        ? { [field]: value, uuid: Not(args.object[ignore]) }
        : { [field]: value };

    const result = await this.dataSource.getRepository(entity).exist({ where });

    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    let [entity] = args.constraints;
    const field = args.constraints[1] || args.property;

    entity = entity.name;
    return `${entity} with the same '${field}' already exist`;
  }
}

export function IsUnique(
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity: Function,
  field?: string,
  ignore?: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'unique',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field, ignore],
      validator: UniqueValidator,
    });
  };
}
