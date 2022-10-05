import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreatePlatformInput {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsOptional()
  content: string
}
