import { CreateStepInput } from './create-step.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class UpdateStepInput extends PartialType(CreateStepInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId
}
