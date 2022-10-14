import { CreateStepInput } from './create-step.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStepInput extends PartialType(CreateStepInput) {
  @Field(() => Int)
  id: number;
}
