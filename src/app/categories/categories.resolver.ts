import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { CategoriesService } from './categories.service'
import { Category } from './entities/category.entity'
import { CreateCategoryInput } from './dto/create-category.input'
import { UpdateCategoryInput } from './dto/update-category.input'
import { InputValidator } from '@shared/validator/input.validator'
import { NotFoundError } from '@shared/errors/not-found.error'
import { Inject, UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { PUB_SUB } from '@apollo/pubsub.module'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import ChanelEnum from '@apollo/chanel.enum'
import { CurrentUser } from '@decorators/user.decorator'
import { UserDocument } from '@app/users/entities/user.entity'
import { DeleteCategoryInput } from '@app/categories/dto/delete-category.input'

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Mutation(() => Category)
  @UseGuards(FirebaseAuthGuard)
  async createCategory(
    @Args('input', new InputValidator())
    input: CreateCategoryInput,
    @CurrentUser() user: UserDocument
  ) {
    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { msg: 'Huỷ thành công', user }
    })
    return this.categoriesService.create(input)
  }

  @Query(() => [Category], { name: 'categories' })
  async findAll() {
    return this.categoriesService.findAll()
  }

  @Query(() => Category, { name: 'category' })
  async findOne(@Args('category') slug: string) {
    const _category = await this.categoriesService.findOne({ slug })
    if (!_category) {
      throw new NotFoundError('Category not found')
    }
    return _category
  }

  @Mutation(() => Category)
  @UseGuards(FirebaseAuthGuard)
  async updateCategory(
    @Args('input', new InputValidator()) input: UpdateCategoryInput
  ) {
    const _category = await this.categoriesService.findOne({ _id: input.id })
    if (!_category) {
      throw new NotFoundError('Category not found')
    }

    const _form: Partial<UpdateCategoryInput> = {}
    Object.entries(input).forEach(([key, value]) => {
      _form[key] = value
    })
    delete _form.id
    return this.categoriesService.update({ _id: _category._id }, _form)
  }

  @Mutation(() => Category)
  @UseGuards(FirebaseAuthGuard)
  async removeCategory(
    @Args('input', new InputValidator()) input: DeleteCategoryInput
  ) {
    const _category = await this.categoriesService.findOne({ _id: input.id })
    if (!_category) {
      throw new NotFoundError('Category not found')
    }
    // Todo: Event dọn dẹp
    return this.categoriesService.remove({ _id: _category._id })
  }
}
