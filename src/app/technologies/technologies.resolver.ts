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
  async findAll() {
    return this.technologiesService.findAll({})
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

    // const _form: Partial<UpdateTechnologyInput> = {}
    // Object.entries(input)
    //   .filter(([_, value]) => value)
    //   .forEach(([key, value]) => (_form[key] = value))
    // delete _form.id
    // if (_form.platform) {
    //   const _platform = await this.platformsService.findOne({
    //     _id: _form.platform
    //   })
    //   if (!_platform) {
    //     throw new NotFoundError('Platform not found')
    //   }
    //   _form.platform = _platform._id
    // }
    //return this.technologiesService.update({ _id: _tech._id }, _form)
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
