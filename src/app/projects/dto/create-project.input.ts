import { InputType, Field, ID, Float } from '@nestjs/graphql'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  MinLength
} from 'class-validator'
import { Types } from 'mongoose'
import { IsObjectID } from '@shared/validator/objectid.validator'

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  covers: string[]

  @Field(() => String)
  @IsNotEmpty()
  content: string

  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  category: Types.ObjectId

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsObjectID({ each: true })
  technologies: Types.ObjectId[]

  @Field(() => [ID], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  files: string[]

  @Field(() => [Float, Float])
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  estimate: [number, number]
}
