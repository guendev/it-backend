import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommentsService } from './comments.service'
import { Comment } from './entities/comment.entity'
import { CreateCommentInput } from './dto/create-comment.input'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { InputValidator } from '@shared/validator/input.validator'
import { CurrentUser } from '@decorators/user.decorator'
import { ProjectsService } from '@app/projects/projects.service'
import { AnyKeys, Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { User } from '@app/users/entities/user.entity'
import { GetCommentsFilter } from '@app/comments/filters/get-comments.filter'
import { GetCommentFilter } from '@app/comments/filters/get-comment.filter'

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly projectsService: ProjectsService
  ) {}

  @Mutation(() => Comment)
  @UseGuards(JWTAuthGuard)
  async createComment(
    @Args('input', new InputValidator()) input: CreateCommentInput,
    @CurrentUser() user: User
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }

    const _doc: AnyKeys<Comment> = {
      content: input.content,
      rate: input.rate,
      user: new Types.ObjectId(user.id),
      project: _project._id
    }
    if (input.parent) {
      const _parent = await this.commentsService.findOne({
        _id: new Types.ObjectId(input.parent)
      })
      if (!_parent) {
        throw new NotFoundError('Parent comment not found')
      }
      _doc.parent = _parent._id
    }

    return this.commentsService.create(_doc)
  }

  @Query(() => [Comment], { name: 'comments' })
  async findAll(
    @Args('filter', new InputValidator()) filter: GetCommentsFilter
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(filter.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }
    return this.commentsService.find({ project: _project._id }, filter)
  }

  @Query(() => Comment, { name: 'comment' })
  async findOne(
    @Args('filter', new InputValidator()) filter: GetCommentFilter
  ) {
    return this.commentsService.findOne({ _id: new Types.ObjectId(filter.id) })
  }
}
