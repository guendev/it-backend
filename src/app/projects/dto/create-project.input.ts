import { InputType, Field, ID, Float } from '@nestjs/graphql'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'
import { Types } from 'mongoose'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { ProjectStatus } from '@app/projects/enums/project.status.enum'

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cover: string

  @Field(() => String, { nullable: true, defaultValue: '' })
  @IsOptional()
  @IsString()
  content: string

  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  category: Types.ObjectId

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsArray()
  @ArrayMinSize(1)
  technologies: string[]

  @Field(() => [Float, Float])
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  estimate: [number, number]

  @Field(() => String, { nullable: true, defaultValue: '' })
  @IsOptional()
  @IsString()
  logo: string

  @Field(() => String, { nullable: true, defaultValue: '' })
  @IsOptional()
  @IsString()
  link: string

  @Field(() => [ID], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  files: string[]

  @Field(() => ProjectStatus, {
    defaultValue: ProjectStatus.PREPARE,
    nullable: true
  })
  status: ProjectStatus
}
