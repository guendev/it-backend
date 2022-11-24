import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { FilterOffet } from '@shared/args/filter-offset.input'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class GetCommentsFilter extends FilterOffet {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  project: Types.ObjectId
}
