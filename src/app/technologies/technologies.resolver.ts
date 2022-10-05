import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TechnologiesService } from './technologies.service';
import { Technology } from './entities/technology.entity';
import { CreateTechnologyInput } from './dto/create-technology.input';
import { UpdateTechnologyInput } from './dto/update-technology.input';

@Resolver(() => Technology)
export class TechnologiesResolver {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Mutation(() => Technology)
  createTechnology(@Args('createTechnologyInput') createTechnologyInput: CreateTechnologyInput) {
    return this.technologiesService.create(createTechnologyInput);
  }

  @Query(() => [Technology], { name: 'technologies' })
  findAll() {
    return this.technologiesService.findAll();
  }

  @Query(() => Technology, { name: 'technology' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.technologiesService.findOne(id);
  }

  @Mutation(() => Technology)
  updateTechnology(@Args('updateTechnologyInput') updateTechnologyInput: UpdateTechnologyInput) {
    return this.technologiesService.update(updateTechnologyInput.id, updateTechnologyInput);
  }

  @Mutation(() => Technology)
  removeTechnology(@Args('id', { type: () => Int }) id: number) {
    return this.technologiesService.remove(id);
  }
}
