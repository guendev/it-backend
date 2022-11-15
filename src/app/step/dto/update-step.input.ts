import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'
import { StepStatus } from '@app/step/enums/step.status.enum'

@InputType()
export class UpdateStepInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(3)
  name?: number

  @Field(() => StepStatus, { nullable: true })
  @IsOptional()
  status?: StepStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string
}
