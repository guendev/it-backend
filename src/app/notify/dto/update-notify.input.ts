import { CreateNotifyInput } from './create-notify.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotifyInput extends PartialType(CreateNotifyInput) {
  @Field(() => Int)
  id: number;
}
