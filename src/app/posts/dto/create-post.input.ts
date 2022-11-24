import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsNotEmpty()
  content: string

  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags: string[]
}
