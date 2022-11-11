import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StepService } from './step.service'
import { Step } from './entities/step.entity'
import { CreateStepInput } from './dto/create-step.input'
import { UpdateStepInput } from './dto/update-step.input'
import { InputValidator } from '@shared/validator/input.validator'
import { ProjectsService } from '@app/projects/projects.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveStepInput } from '@app/step/dto/remove-step.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'

@Resolver(() => Step)
export class StepResolver {
  constructor(
    private readonly stepService: StepService,
    private readonly projectService: ProjectsService
  ) {}

  @Mutation(() => Step)
  @UseGuards(FirebaseAuthGuard)
  async createStep(
    @Args('input', new InputValidator()) input: CreateStepInput
  ) {
    // Todo: check permission
    const _project = await this.projectService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new Error('Project not found')
    }

    const _steps = await this.stepService.findMany({
      project: new Types.ObjectId(input.project)
    })
    const _order = _steps.sort((a, b) => b.order - a.order)[0]?.order || 0

    return this.stepService.create({
      ...input,
      project: new Types.ObjectId(input.project),
      order: _order + 1
    })
  }

  @Query(() => [Step], { name: 'steps' })
  async findAll(@Args('input', new InputValidator()) input: UpdateStepInput) {
    const _project = await this.projectService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new Error('Project not found')
    }
    return this.stepService.findAll({ project: _project._id })
  }

  @Mutation(() => Step)
  async updateStep(
    @Args('input', new InputValidator()) input: UpdateStepInput
  ) {
    const _step = await this.stepService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_step) {
      throw new NotFoundError('Step not found')
    }
    // Todo: check if project exists
    // Todo: check permission
    delete input.id
    const _newRole = await this.stepService.update(input.id, input)
    // Todo: event check lại các step khác
    return _newRole
  }

  // @Mutation(() => Step)
  // async checkStep(@Args('input', new InputValidator()) input: CheckStepInput) {
  //   // Todo: check auth, event, etc
  //   const _step = await this.stepService.update(
  //     { _id: new Types.ObjectId(input.id) },
  //     { status: StepStatus.DONE }
  //   )
  //   if (!_step) {
  //     throw new Error('Step not found')
  //   }
  //   return _step
  // }

  @Mutation(() => Step)
  async removeStep(
    @Args('input', new InputValidator()) input: RemoveStepInput
  ) {
    const _step = await this.stepService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_step) {
      throw new NotFoundError('Step not found')
    }
    // Todo: check if project exists
    // Todo: check permission
    return this.stepService.remove(_step)
  }
}
