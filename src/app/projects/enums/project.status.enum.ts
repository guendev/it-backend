import { registerEnumType } from '@nestjs/graphql'

export enum ProjectStatus {
  ON_GOING = 'OnGoing',
  END = 'End',
  DROP = 'Drop'
}

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus'
})
