import { InputType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsOptional } from 'class-validator'
import { FilterOffet } from '@shared/args/filter-offset.input'
import { IsObjectID } from '@shared/validator/objectid.validator'

@InputType()
export class GetUsersFilter extends FilterOffet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string

  @Field(() => [ID], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  @IsObjectID({ each: true })
  exclude?: string[]
}
