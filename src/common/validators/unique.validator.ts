import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, Not } from 'typeorm';

export type UniqueValidatorOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity: Function;
  column?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ignoreValue?: string | Function;
  ignoreColumn?: string;
};

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    if (!value) return false;

    const [
      { entity, column = args.property, ignoreValue, ignoreColumn = 'id' },
    ] = args.constraints;

    let where = { [column]: value };

    if (typeof ignoreValue === 'string' || 'function') {
      where = {
        ...where,
        // TODO: figure the ignoreValue function option  out
        [ignoreColumn]: Not(
          typeof ignoreValue === 'function' ? ignoreValue() : ignoreValue,
        ),
      };
    }

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
  options: UniqueValidatorOptions,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'unique',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: UniqueValidator,
    });
  };
}
