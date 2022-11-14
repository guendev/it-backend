import { InputType, Field } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { FilterOffet } from '@shared/args/filter-offset.input'

@InputType()
export class GetUsersFilter extends FilterOffet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string
}
