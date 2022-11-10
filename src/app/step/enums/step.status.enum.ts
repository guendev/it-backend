import { registerEnumType } from '@nestjs/graphql'

export enum StepStatus {
  WAITING = 'Waiting',
  DONE = 'Done'
}

registerEnumType(StepStatus, {
  name: 'StepStatus'
})
