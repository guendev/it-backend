import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsResolver } from './posts.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { PostEntity } from '@app/posts/entities/post.entity'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PostsModule.name,
        useFactory: () => {
          return PostEntity
        }
      }
    ])
  ],
  providers: [PostsResolver, PostsService]
})
export class PostsModule {}
