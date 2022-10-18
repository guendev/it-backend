import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StepService } from './step.service'
import { Step } from './entities/step.entity'
import { CreateStepInput } from './dto/create-step.input'
import { UpdateStepInput } from './dto/update-step.input'
import { CreateStepsInput } from '@app/step/dto/create-steps.input'
import { InputValidator } from '@shared/validator/input.validator'
import { ProjectsService } from '@app/projects/projects.service'
import { Types } from 'mongoose'
import { CheckStepInput } from '@app/step/dto/check-step.input'
import { StepStatus } from '@app/step/enums/project.status.enum'

@Resolver(() => Step)
export class StepResolver {
  constructor(
    private readonly stepService: StepService,
    private readonly projectService: ProjectsService
  ) {}

  @Mutation(() => Step)
  createStep(@Args('createStepInput') createStepInput: CreateStepInput) {
    return this.stepService.create(createStepInput)
  }

  @Mutation(() => [Step])
  async createSteps(
    @Args('input', new InputValidator()) input: CreateStepsInput
  ) {
    const _project = await this.projectService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new Error('Project not found')
    }
    const _steps = await this.stepService.findMany({
      project: new Types.ObjectId(input.project)
    })
    const _lastOrder = _steps.sort((a, b) => b.order - a.order)[0]?.order || 0
    //
    return await Promise.all(
      input.steps.map(
        (step, index) =>
          new Promise((resolve, reject) => {
            this.stepService
              .create({
                ...step,
                project: new Types.ObjectId(input.project),
                order: _lastOrder + index + 1
              })
              .then(resolve)
              .catch(reject)
          })
      )
    )
  }

  @Query(() => [Step], { name: 'step' })
  findAll() {
    return this.stepService.findAll()
  }

  @Query(() => Step, { name: 'step' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    // return this.stepService.findOne(id)
  }

  @Mutation(() => Step)
  updateStep(@Args('updateStepInput') updateStepInput: UpdateStepInput) {
    // return this.stepService.update(updateStepInput.id, updateStepInput)
  }

  @Mutation(() => Step)
  async checkStep(@Args('input', new InputValidator()) input: CheckStepInput) {
    // Todo: check auth, event, etc
    const _step = await this.stepService.update(
      { _id: new Types.ObjectId(input.id) },
      { status: StepStatus.DONE }
    )
    if (!_step) {
      throw new Error('Step not found')
    }
    return _step
  }

  @Mutation(() => Step)
  removeStep(@Args('id', { type: () => Int }) id: number) {
    return this.stepService.remove(id)
  }
}
