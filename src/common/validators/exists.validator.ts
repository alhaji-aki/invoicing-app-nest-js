import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type ExistsValidatorOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity: Function;
  column?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  extraConditions?: Function;
};

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    if (!value) return true;

    const {
      entity,
      column = args.property,
      extraConditions,
    } = args.constraints[0];

    let where = { [column]: value };

    if (extraConditions) {
      where = {
        ...where,
        ...extraConditions(args.object),
      };
    }

    return await this.dataSource.getRepository(entity).exist({ where });
  }

  defaultMessage(args: ValidationArguments) {
    const constraints: ExistsValidatorOptions = args.constraints[0];

    return `${constraints.entity.name} selected does not exist`;
  }
}

export function IsExists(
  options: ExistsValidatorOptions,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'exists',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistsValidator,
    });
  };
}
