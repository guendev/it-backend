import { InputType, Int, Field } from '@nestjs/graphql'
import { StepStatus } from '@app/step/enums/project.status.enum'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'

@InputType()
export class CreateStepInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number
}

@InputType()
export class StepDocInput {
  @Field(() => String)
  @MinLength(3)
  @IsNotEmpty()
  name: number

  @Field(() => StepStatus, { defaultValue: StepStatus.WAITING })
  @IsOptional()
  status: StepStatus
}
