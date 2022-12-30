import { CreateRoleInput } from './create-role.input'
import { InputType, Field, PartialType, ID, OmitType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'

@InputType()
export class UpdateRoleInput extends OmitType(PartialType(CreateRoleInput), [
  'project',
  'count'
] as const) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsObjectID()
  user: Types.ObjectId
}
