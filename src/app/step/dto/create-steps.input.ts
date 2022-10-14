import { InputType, Field, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { IsArray, IsNotEmpty } from 'class-validator'
import { StepDocInput } from '@app/step/dto/create-step.input'

@InputType()
export class CreateStepsInput {
  @Field(() => ID)
  @IsObjectID()
  @IsNotEmpty()
  project: Types.ObjectId

  @Field(() => [StepDocInput])
  @IsArray()
  steps: StepDocInput[]
}
