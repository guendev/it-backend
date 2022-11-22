import { CreateFirebaseInput } from './create-firebase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFirebaseInput extends PartialType(CreateFirebaseInput) {
  @Field(() => Int)
  id: number;
}
