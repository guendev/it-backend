import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StepService } from './step.service'
import { Step, StepDocument } from './entities/step.entity'
import { CreateStepInput } from './dto/create-step.input'
import { UpdateStepInput } from './dto/update-step.input'
import { InputValidator } from '@shared/validator/input.validator'
import { ProjectsService } from '@app/projects/projects.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveStepInput } from '@app/step/dto/remove-step.input'
import { Inject, UseGuards } from '@nestjs/common'
import { FirebaseGuard } from '../../guards/firebase.guard'
import { GetStepsFilter } from '@app/step/filters/get-steps.filter'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SortStepsInput } from '@app/step/dto/sort-steps.input'
import { StepStatus } from '@app/step/enums/step.status.enum'
import { JWTAuthGuard } from '../../guards/jwt.guard'
import { PUB_SUB } from '@apollo/pubsub.module'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import ChanelEnum from '@apollo/chanel.enum'
import { CurrentUser } from "@decorators/user.decorator";

@Resolver(() => Step)
export class StepResolver {
  constructor(
    private readonly stepService: StepService,
    private readonly projectService: ProjectsService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Mutation(() => Step)
  @UseGuards(JWTAuthGuard)
  async createStep(
    @Args('input', new InputValidator()) input: CreateStepInput,
    @CurrentUser() user
  ) {
    // Todo: check permission
    const _project = await this.projectService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new Error('Project not found')
    }

    const _steps = await this.stepService.find({
      project: new Types.ObjectId(input.project)
    })
    const _order = _steps.sort((a, b) => b.order - a.order)[0]?.order || 0

    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Thêm thành công' }
    })

    return this.stepService.create({
      ...input,
      project: new Types.ObjectId(input.project),
      order: _order + 1
    })
  }

  @Query(() => [Step], { name: 'steps' })
  async findAll(@Args('filter', new InputValidator()) filter: GetStepsFilter) {
    const _project = await this.projectService.findOne({
      _id: new Types.ObjectId(filter.project)
    })
    if (!_project) {
      throw new Error('Project not found')
    }
    return this.stepService.find({
      project: _project._id
    })
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
    const _newStep = await this.stepService.update(_step, input)
    // check ddieuef kien
    if (_newStep.status !== _step.status) {
      this.eventEmitter.emit('step.checked', {
        anchor: _newStep
      })
    }

    return _newStep
  }

  @Mutation(() => [Step])
  async sortSteps(@Args('input', new InputValidator()) input: SortStepsInput) {
    if (!input.steps.length) {
      return []
    }
    // validate first step
    const _first = input.steps[0]
    const _firstStep = await this.stepService.findOne({
      _id: new Types.ObjectId(_first)
    })
    if (!_firstStep) {
      throw new NotFoundError('Step not found')
    }
    // Todo: Check permission
    const _steps = await this.stepService.find({
      project: _firstStep.project,
      _id: { $in: input.steps.map((id) => new Types.ObjectId(id)) }
    })
    if (_steps.length !== input.steps.length) {
      throw new Error('Some steps not found')
    }
    const newSteps = await Promise.all<StepDocument>(
      input.steps.map(
        (step, index) =>
          new Promise((resolve, reject) => {
            this.stepService
              .update(
                {
                  _id: new Types.ObjectId(step)
                } as StepDocument,
                {
                  status: StepStatus.WAITING,
                  order: index + 1
                } as any
              )
              .then(resolve)
              .catch(reject)
          })
      )
    )

    return newSteps.sort((a, b) => a.order - b.order)
  }

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
