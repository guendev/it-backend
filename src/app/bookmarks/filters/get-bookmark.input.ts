import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class GetBookmarkInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  project: Types.ObjectId
}
