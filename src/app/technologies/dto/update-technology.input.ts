import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class UpdateTechnologyInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId

  @Field()
  @IsOptional()
  name: string

  @Field()
  @IsOptional()
  content: string
}
