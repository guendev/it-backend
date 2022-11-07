import { registerEnumType } from '@nestjs/graphql'

export enum PermissionEnum {
  // Chỉnh sửa dự án
  UPDATE_PROJECT,
  REMOVE_PROJECT,

  // Role
  CREATE_ROLE,
  UPDATE_ROLE,
  REMOVE_ROLE,

  // Member
  ACCEPT_MEMBER,
  REMOVE_MEMBER
}

registerEnumType(PermissionEnum, {
  name: 'PermissionEnum'
})
