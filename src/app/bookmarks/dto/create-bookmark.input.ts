import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookmarkInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
