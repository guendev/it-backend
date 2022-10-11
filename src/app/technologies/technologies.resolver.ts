import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { TechnologiesService } from './technologies.service'
import { Technology } from './entities/technology.entity'
import { CreateTechnologyInput } from './dto/create-technology.input'
import { UpdateTechnologyInput } from './dto/update-technology.input'
import { InputValidator } from '@shared/validator/input.validator'
import { PlatformsService } from '@app/platforms/platforms.service'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveTechnologyInput } from '@app/technologies/dto/remove-technology.input'
import { Types } from 'mongoose'

@Resolver(() => Technology)
export class TechnologiesResolver {
  constructor(
    private readonly technologiesService: TechnologiesService,
    private readonly platformsService: PlatformsService
  ) {}

  @Mutation(() => Technology)
  async createTechnology(
    @Args('input', new InputValidator())
    input: CreateTechnologyInput
  ) {
    const _platform = await this.platformsService.findOne({
      _id: input.platform
    })
    if (!_platform) {
      throw new NotFoundError('Platform not found')
    }
    return this.technologiesService.create({
      name: input.name,
      content: input.content,
      platform: _platform._id
    })
  }

  @Query(() => [Technology], { name: 'technologies' })
  findAll() {
    // return this.technologiesService.findAll()
  }

  @Query(() => Technology, { name: 'technology' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    // return this.technologiesService.findOne(id)
  }

  @Mutation(() => Technology)
  async updateTechnology(
    @Args('input', new InputValidator()) input: UpdateTechnologyInput
  ) {
    const _tech = await this.technologiesService.findOne({ _id: input.id })
    if (!_tech) {
      throw new NotFoundError('Tech not found')
    }

    const _form: Partial<UpdateTechnologyInput> = {}
    Object.entries(input)
      .filter(([_, value]) => value)
      .forEach(([key, value]) => (_form[key] = value))
    delete _form.id
    if (_form.platform) {
      const _platform = await this.platformsService.findOne({
        _id: _form.platform
      })
      if (!_platform) {
        throw new NotFoundError('Platform not found')
      }
      _form.platform = _platform._id
    }
    return this.technologiesService.update({ _id: _tech._id }, _form)
  }

  @Mutation(() => Technology)
  async removeTechnology(
    @Args('input', new InputValidator()) input: RemoveTechnologyInput
  ) {
    const _tech = await this.technologiesService.findOne({ _id: input.id })
    if (!_tech) {
      throw new NotFoundError('Tech not found')
    }
    // Todo: clear all projects that use this technology
    return this.technologiesService.remove({ _id: _tech._id })
  }

  @ResolveField()
  async platform(@Parent() author: Technology) {
    return this.platformsService.findOne({
      _id: new Types.ObjectId(author.platform as unknown as string)
    })
  }
}
