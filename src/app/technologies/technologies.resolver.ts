import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { TechnologiesService } from './technologies.service'
import { Technology } from './entities/technology.entity'
import { CreateTechnologyInput } from './dto/create-technology.input'
import { UpdateTechnologyInput } from './dto/update-technology.input'
import { InputValidator } from '@shared/validator/input.validator'
import { PlatformsService } from '@app/platforms/platforms.service'
import { NotFoundError } from '@shared/errors/not-found.error'

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
    return this.technologiesService.findAll()
  }

  @Query(() => Technology, { name: 'technology' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.technologiesService.findOne(id)
  }

  @Mutation(() => Technology)
  updateTechnology(
    @Args('updateTechnologyInput') updateTechnologyInput: UpdateTechnologyInput
  ) {
    //
  }

  @Mutation(() => Technology)
  removeTechnology(@Args('id', { type: () => Int }) id: number) {
    return this.technologiesService.remove(id)
  }
}
