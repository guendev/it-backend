import { CreateCommentLikeInput } from './create-comment-like.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentLikeInput extends PartialType(CreateCommentLikeInput) {
  @Field(() => Int)
  id: number;
}
