import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'

@InputType()
export class CreateProposalInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  role: string

  @Field(() => String, { nullable: true })
  letter: string

  @Field(() => String, { nullable: true })
  resume: string
}
