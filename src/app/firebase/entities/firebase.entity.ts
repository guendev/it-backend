import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Firebase {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
