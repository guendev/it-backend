import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { PlatformsService } from './platforms.service'
import { Platform } from './entities/platform.entity'
import { CreatePlatformInput } from './dto/create-platform.input'
import { UpdatePlatformInput } from './dto/update-platform.input'
import { InputValidator } from '@shared/validator/input.validator'
import { TechnologiesService } from '@app/technologies/technologies.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { UpdateGridPlatformInput } from '@app/platforms/dto/update-grid-platform.input'

@Resolver(() => Platform)
export class PlatformsResolver {
  constructor(
    private readonly platformsService: PlatformsService,
    private readonly technologiesService: TechnologiesService
  ) {}

  @Mutation(() => Platform)
  async createPlatform(
    @Args('input', new InputValidator()) input: CreatePlatformInput
  ) {
    return this.platformsService.create(input)
  }

  @Query(() => [Platform], { name: 'platforms' })
  findAll() {
    return this.platformsService.findAll()
  }

  @Query(() => Platform, { name: 'platform' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    //
  }

  @Mutation(() => Platform)
  async updatePlatform(
    @Args('input', new InputValidator()) input: UpdatePlatformInput
  ) {
    const _category = await this.platformsService.findOne({ _id: input.id })
    if (!_category) {
      throw new NotFoundError('Category not found')
    }

    const _form: Partial<UpdatePlatformInput> = {}
    Object.entries(input).forEach(([key, value]) => {
      _form[key] = value
    })
    delete _form.id
    return this.platformsService.update({ _id: _category._id }, _form)
  }

  @Mutation(() => [Platform])
  async updateGridPlatform(
    @Args('input', new InputValidator()) input: UpdateGridPlatformInput
  ) {
    const list: {
      parent: Types.ObjectId
      _id: Types.ObjectId
    }[] = input.map
      .filter((item) => Types.ObjectId.isValid(item.id))
      .map((item) => ({
        _id: new Types.ObjectId(item.id),
        children: item.children
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id))
      }))
      .reduce((acc, item) => {
        acc.push(
          ...item.children.map((child) => ({
            parent: item._id,
            _id: child
          }))
        )
        return acc
      }, [])

    const result = await Promise.all<Platform>(
      list.map(
        (parent) =>
          new Promise((resolve) => {
            this.technologiesService
              .update({ _id: parent._id }, { platform: parent.parent })
              .then((item) => resolve(item as unknown as Platform))
          })
      )
    )

    return result.filter((item) => item)
  }

  @Mutation(() => Platform)
  removePlatform(@Args('id', { type: () => Int }) id: number) {
    return this.platformsService.remove(id)
  }

  @ResolveField()
  async children(@Parent() author: Platform) {
    console.log(author)
    const { id } = author
    return this.technologiesService.findAll({
      platform: new Types.ObjectId(id)
    })
  }
}
