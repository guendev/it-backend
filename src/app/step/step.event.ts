import { OnEvent } from '@nestjs/event-emitter'
import { StepDocument } from '@app/step/entities/step.entity'
import { StepService } from '@app/step/step.service'
import { Injectable } from '@nestjs/common'
import { StepStatus } from '@app/step/enums/step.status.enum'

@Injectable()
export class StepEvent {
  constructor(private readonly stepService: StepService) {}

  @OnEvent('step.checked')
  async afterStepChecked({ anchor }: { anchor: StepDocument }) {
    const steps = await this.stepService.find({ project: anchor.project })

    const _newSteps = await Promise.all(
      steps.map(
        (step) =>
          new Promise((resolve, reject) => {
            if (anchor.order >= step.order) {
              this.stepService
                .update(step, {
                  status: StepStatus.DONE
                })
                .then(resolve)
                .catch(reject)
            } else {
              this.stepService
                .update(step, { status: StepStatus.WAITING })
                .then(resolve)
                .catch(reject)
            }
          })
      )
    )

    console.log(_newSteps)
  }
}
