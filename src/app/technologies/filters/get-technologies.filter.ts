import { InputType, Field, OmitType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { FilterOffet } from '@shared/args/filter-offset.input'

@InputType()
export class GetTechnologiesFilter extends OmitType(FilterOffet, [
  'sort'
] as const) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string
}
