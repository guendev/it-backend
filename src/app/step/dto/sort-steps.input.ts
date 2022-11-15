import { InputType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class SortStepsInput {
  @Field(() => [ID])
  @IsNotEmpty()
  @IsArray()
  @IsObjectID({ each: true })
  steps: Types.ObjectId[]
}
