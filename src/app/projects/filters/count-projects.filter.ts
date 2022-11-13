import { InputType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsOptional } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { ProjectStatus } from '@app/projects/enums/project.status.enum'

@InputType()
export class CountProjectsFilter {
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
