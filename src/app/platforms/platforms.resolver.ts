import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { PlatformsService } from './platforms.service'
import { Platform } from './entities/platform.entity'
import { CreatePlatformInput } from './dto/create-platform.input'
import { UpdatePlatformInput } from './dto/update-platform.input'
import { InputValidator } from '@shared/validator/input.validator'

@Resolver(() => Platform)
export class PlatformsResolver {
  constructor(private readonly platformsService: PlatformsService) {}

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
  updatePlatform(
    @Args('updatePlatformInput') updatePlatformInput: UpdatePlatformInput
  ) {
    return this.platformsService.update(
      updatePlatformInput.id,
      updatePlatformInput
    )
  }

  @Mutation(() => Platform)
  removePlatform(@Args('id', { type: () => Int }) id: number) {
    return this.platformsService.remove(id)
  }
}