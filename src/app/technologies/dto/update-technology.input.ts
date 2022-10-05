import { CreateTechnologyInput } from './create-technology.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTechnologyInput extends PartialType(CreateTechnologyInput) {
  @Field(() => Int)
  id: number;
}
