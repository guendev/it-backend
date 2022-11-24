import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'
import { FilterOffet } from '@shared/args/filter-offset.input'

@InputType()
export class GetBookmarksInput extends FilterOffet {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  project: Types.ObjectId
}
