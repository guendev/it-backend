import { registerEnumType } from '@nestjs/graphql'

export enum StepStatus {
  WAITING = 'Waiting',
  DOING = 'Doing',
  DONE = 'Done'
}

registerEnumType(StepStatus, {
  name: 'StepStatus'
})
