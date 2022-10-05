import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { TechnologiesService } from './technologies.service'
import { Technology } from './entities/technology.entity'
import { CreateTechnologyInput } from './dto/create-technology.input'
import { UpdateTechnologyInput } from './dto/update-technology.input'
import { InputValidator } from '@shared/validator/input.validator'

@Resolver(() => Technology)
export class TechnologiesResolver {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Mutation(() => Technology)
  createTechnology(
    @Args('input', new InputValidator())
    input: CreateTechnologyInput
  ) {
    return this.technologiesService.create(input)
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
