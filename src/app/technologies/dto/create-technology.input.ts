import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class CreateTechnologyInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  platform: Types.ObjectId

  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsOptional()
  content: string
}
