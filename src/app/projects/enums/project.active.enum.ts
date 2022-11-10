import { registerEnumType } from '@nestjs/graphql'

export enum ProjectActive {
  DISABLED,
  ACTIVE
}

registerEnumType(ProjectActive, {
  name: 'ProjectActive'
})
