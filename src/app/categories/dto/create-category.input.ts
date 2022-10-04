import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  avatar: string

  @Field()
  @IsOptional()
  primary: boolean

  @Field()
  @IsOptional()
  content: string
}
