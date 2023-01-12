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
  // eslint-disable-next-line @typescript-eslint/ban-types
  extraConditions?: Function;
};

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    const {
      entity,
      column = args.property,
      ignoreValue,
      ignoreColumn = 'id',
      extraConditions,
    } = args.constraints[0];

    let where = { [column]: value };

    if (extraConditions) {
      where = {
        ...where,
        ...extraConditions(args.object),
      };
    }

    if (typeof ignoreValue === 'string' || typeof ignoreValue === 'function') {
      where = {
        ...where,
        [ignoreColumn]: Not(
          typeof ignoreValue === 'function'
            ? ignoreValue(args.object)
            : ignoreValue,
        ),
      };
    }

    const result = await this.dataSource.getRepository(entity).exist({ where });

    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    const constraints: UniqueValidatorOptions = args.constraints[0];

    const column = constraints.column ?? args.property;

    return `${constraints.entity.name} with the same '${column}' already exist`;
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
