import { Field, ID, InputType, OmitType } from '@nestjs/graphql'
import { GetProjectsFilter } from '@app/projects/filters/get-projects.filter'
import { IsArray, IsOptional } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'

@InputType()
export class ExampleProjectsFilter extends OmitType(GetProjectsFilter, [
  'offset',
  'sort'
] as const) {
  @Field(() => [ID], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  @IsObjectID({ each: true })
  exclude?: string[]
}
