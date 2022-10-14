import { registerEnumType } from '@nestjs/graphql'

export enum PermissionEnum {
  WAITING = 'Waiting',
  DOING = 'Doing',
  DONE = 'Done'
}

registerEnumType(PermissionEnum, {
  name: 'PermissionEnum'
})
