import { registerEnumType } from '@nestjs/graphql'

export enum ProjectActive {
  DRAFT,
  ACTIVE,
  DISABLED
}

registerEnumType(ProjectActive, {
  name: 'ProjectActive'
})
