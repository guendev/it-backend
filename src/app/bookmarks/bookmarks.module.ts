import { forwardRef, Module } from '@nestjs/common'
import { BookmarksService } from './bookmarks.service'
import { BookmarksResolver } from './bookmarks.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Bookmark,
  BookmarkEntity
} from '@app/bookmarks/entities/bookmark.entity'
import { ProjectsModule } from '@app/projects/projects.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Bookmark.name,
        useFactory: () => {
          return BookmarkEntity
        }
      }
    ]),
    forwardRef(() => ProjectsModule)
  ],
  providers: [BookmarksResolver, BookmarksService]
})
export class BookmarksModule {}
