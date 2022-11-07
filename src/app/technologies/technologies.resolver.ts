import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { TechnologiesService } from './technologies.service'
import { Technology } from './entities/technology.entity'
import { CreateTechnologyInput } from './dto/create-technology.input'
import { UpdateTechnologyInput } from './dto/update-technology.input'
import { InputValidator } from '@shared/validator/input.validator'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveTechnologyInput } from '@app/technologies/dto/remove-technology.input'

@Resolver(() => Technology)
export class TechnologiesResolver {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Mutation(() => Technology)
  async createTechnology(
    @Args('input', new InputValidator())
    input: CreateTechnologyInput
  ) {
    return this.technologiesService.create(input)
  }

  @Query(() => [Technology], { name: 'technologies' })
  async findMany() {
    return this.technologiesService.findAll({})
  }

  @Query(() => Technology, { name: 'technology' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
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
    // Todo: update tech
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
}
