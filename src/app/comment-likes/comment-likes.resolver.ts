import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommentLikesService } from './comment-likes.service'
import { CommentLike } from './entities/comment-like.entity'
import { CreateCommentLikeInput } from './dto/create-comment-like.input'
import { CommentsService } from '@app/comments/comments.service'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { User } from '@app/users/entities/user.entity'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { InputValidator } from '@shared/validator/input.validator'
import { GetCommentLikeFilter } from '@app/comment-likes/filters/get-comment-like.filter'

@Resolver(() => CommentLike)
export class CommentLikesResolver {
  constructor(
    private readonly commentLikesService: CommentLikesService,
    private readonly commentsService: CommentsService
  ) {}

  @Mutation(() => CommentLike, { nullable: true })
  @UseGuards(JWTAuthGuard)
  async toggleCommentLike(
    @Args('input') input: CreateCommentLikeInput,
    @CurrentUser() user: User
  ) {
    const _comment = await this.commentsService.findOne({
      _id: new Types.ObjectId(input.comment)
    })
    if (!_comment) {
      throw new NotFoundError('Comment not found')
    }

    const _record = await this.commentLikesService.findOne({
      comment: _comment._id,
      user: new Types.ObjectId(user.id)
    })

    // Không có thì like có thì huỷ bỏ
    if (!_record) {
      return this.commentLikesService.create({
        comment: _comment._id,
        user: new Types.ObjectId(user.id)
      })
    }

    //
    return this.commentLikesService.create({
      comment: _comment._id,
      user: new Types.ObjectId(user.id)
    })
  }

  @Query(() => CommentLike, { name: 'commentLike', nullable: true })
  @UseGuards(JWTAuthGuard)
  async findOne(
    @Args('filter', new InputValidator()) filter: GetCommentLikeFilter,
    @CurrentUser() user: User
  ) {
    const _comment = await this.commentsService.findOne({
      _id: new Types.ObjectId(filter.comment)
    })
    if (!_comment) {
      throw new NotFoundError('Comment not found')
    }
    return this.commentLikesService.findOne({
      comment: _comment._id,
      user: new Types.ObjectId(user.id)
    })
  }
}
