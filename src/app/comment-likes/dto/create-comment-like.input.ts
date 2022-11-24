import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class CreateCommentLikeInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  comment: Types.ObjectId
}
