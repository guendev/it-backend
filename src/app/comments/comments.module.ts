import { forwardRef, Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsResolver } from './comments.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentEntity, Comment } from '@app/comments/entities/comment.entity'
import { ProjectsModule } from '@app/projects/projects.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => {
          return CommentEntity
        }
      }
    ]),
    forwardRef(() => ProjectsModule)
  ],
  providers: [CommentsResolver, CommentsService]
})
export class CommentsModule {}
