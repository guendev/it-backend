import { registerEnumType } from '@nestjs/graphql'

export enum ProjectStatus {
  PREPARE,
  RUNNING,
  DONE,
  STUCK
}

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus'
})
