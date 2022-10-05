import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTechnologyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
