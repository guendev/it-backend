import { Module } from '@nestjs/common'
import { CommentLikesService } from './comment-likes.service'
import { CommentLikesResolver } from './comment-likes.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  CommentLike,
  CommentLikeEntity
} from '@app/comment-likes/entities/comment-like.entity'
import { CommentsModule } from '@app/comments/comments.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CommentLike.name,
        useFactory: () => {
          return CommentLikeEntity
        }
      }
    ]),
    CommentsModule
  ],
  providers: [CommentLikesResolver, CommentLikesService]
})
export class CommentLikesModule {}
