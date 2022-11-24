import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { BookmarksService } from './bookmarks.service'
import { Bookmark } from './entities/bookmark.entity'
import { CreateBookmarkInput } from './dto/create-bookmark.input'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { ProjectsService } from '@app/projects/projects.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { InputValidator } from '@shared/validator/input.validator'
import { GetBookmarkInput } from '@app/bookmarks/filters/get-bookmark.input'
import { RemoveBookmarkInput } from '@app/bookmarks/dto/remove-bookmark.input'
import { GetBookmarksInput } from '@app/bookmarks/filters/get-bookmarks.input'

@Resolver(() => Bookmark)
export class BookmarksResolver {
  constructor(
    private readonly bookmarksService: BookmarksService,
    private readonly projectsService: ProjectsService
  ) {}

  @Mutation(() => Bookmark, { nullable: true })
  @UseGuards(JWTAuthGuard)
  async toggleBookmark(
    @Args('input', new InputValidator()) input: CreateBookmarkInput,
    @CurrentUser() user: User
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }

    const _record = await this.bookmarksService.findOne({
      project: _project._id,
      user: new Types.ObjectId(user.id)
    })

    if (_record) {
      return this.bookmarksService.remove({
        project: _project._id,
        user: new Types.ObjectId(user.id)
      })
    }

    return this.bookmarksService.create(user as UserDocument, _project)
  }

  @Query(() => [Bookmark], { name: 'bookmarks' })
  @UseGuards(JWTAuthGuard)
  async find(
    @Args('filter', new InputValidator()) filter: GetBookmarksInput,
    @CurrentUser() user: User
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(filter.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }
    return this.bookmarksService.find(
      { project: _project._id, user: new Types.ObjectId(user.id) },
      filter
    )
  }

  @Query(() => Bookmark, { name: 'bookmark', nullable: true })
  @UseGuards(JWTAuthGuard)
  async findOne(
    @Args('filter', new InputValidator()) filter: GetBookmarkInput,
    @CurrentUser() user: User
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(filter.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }
    return this.bookmarksService.findOne({
      project: _project._id,
      user: new Types.ObjectId(user.id)
    })
  }
}
