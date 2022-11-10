import { CreateBookmarkInput } from './create-bookmark.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBookmarkInput extends PartialType(CreateBookmarkInput) {
  @Field(() => Int)
  id: number;
}
