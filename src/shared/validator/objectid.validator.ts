import { Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'IsObjectID' })
@Injectable()
export class IsObjectIDRule implements ValidatorConstraintInterface {
  validate(value: string | string[]) {
    // return Types.ObjectId.isValid(value)
    return Array.isArray(value)
      ? value.every((v) => Types.ObjectId.isValid(v))
      : Types.ObjectId.isValid(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not a ObjectID`
  }
}

export function IsObjectID(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsObjectID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsObjectIDRule
    })
  }
}
