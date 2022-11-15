import { InputType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsOptional } from 'class-validator'
import { FilterOffet } from '@shared/args/filter-offset.input'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { ProjectStatus } from '@app/projects/enums/project.status.enum'
import { ProjectActive } from '@app/projects/enums/project.active.enum'

@InputType()
export class GetProjectsFilter extends FilterOffet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsOptional()
  category?: string

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsObjectID({ each: true })
  technologies?: string[]

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  status?: ProjectStatus
}

@InputType()
export class GetMyProjectsFilter extends GetProjectsFilter {
  @Field(() => [ProjectActive], { nullable: true, defaultValue: [] })
  @IsOptional()
  active: ProjectActive[]
}
