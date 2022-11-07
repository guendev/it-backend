import { InputType, Field, ID } from '@nestjs/graphql'
import { StepStatus } from '@app/step/enums/project.status.enum'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class CreateStepInput {
  @Field(() => String)
  @MinLength(3)
  @IsNotEmpty()
  name: number

  @Field(() => StepStatus, { defaultValue: StepStatus.WAITING })
  @IsOptional()
  status: StepStatus

  @Field(() => String, { defaultValue: '' })
  @IsOptional()
  content: string

  @Field(() => ID)
  @IsObjectID()
  @IsNotEmpty()
  project: Types.ObjectId
}
