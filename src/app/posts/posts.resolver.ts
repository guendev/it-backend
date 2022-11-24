import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { PostsService } from './posts.service'
import { Post } from './entities/post.entity'
import { CreatePostInput } from './dto/create-post.input'
import { UpdatePostInput } from './dto/update-post.input'
import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { User } from '@app/users/entities/user.entity'
import { AnyKeys, Types } from 'mongoose'
import { InputValidator } from '@shared/validator/input.validator'
import { GetPostsFilter } from '@app/posts/filters/get-posts.filter'
import { GetPostFilter } from '@app/posts/filters/get-post.filter'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemovePostInput } from '@app/posts/dto/remove-post.input'

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: User
  ) {
    return this.postsService.create({
      ...input,
      user: new Types.ObjectId(user.id)
    })
  }

  @Query(() => [Post], { name: 'posts' })
  async findAll(@Args('filter', new InputValidator()) filter: GetPostsFilter) {
    return this.postsService.find({}, filter)
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('filter', new InputValidator()) filter: GetPostFilter) {
    return this.postsService.findOne({ _id: new Types.ObjectId(filter.id) })
  }

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard)
  async updatePost(
    @Args('input') input: UpdatePostInput,
    @CurrentUser() user: User
  ) {
    const _post = await this.postsService.findOne({
      _id: new Types.ObjectId(input.id),
      user: new Types.ObjectId(user.id)
    })
    if (!_post) {
      throw new NotFoundError('Post not found')
    }
    const _doc: AnyKeys<Post> = {
      content: input.content,
      tags: input.tags
    }
    return this.postsService.update(_post, _doc)
  }

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard)
  async removePost(
    @Args('input', new InputValidator()) input: RemovePostInput,
    @CurrentUser() user: User
  ) {
    const _post = await this.postsService.findOne({
      _id: new Types.ObjectId(input.id),
      user: new Types.ObjectId(user.id)
    })
    if (!_post) {
      throw new NotFoundError('Post not found')
    }
    return this.postsService.remove({ _id: _post._id })
  }
}
