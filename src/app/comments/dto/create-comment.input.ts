import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  project: Types.ObjectId

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsObjectID()
  parent: Types.ObjectId

  @Field(() => String)
  @IsNotEmpty()
  content: string

  @Field(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5 * 4)
  rate: number
}
