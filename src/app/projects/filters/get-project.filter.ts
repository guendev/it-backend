import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class GetProjectFilter {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId
}
