import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
  USER,
  ADMIN,
  SP_ADMIN
}

registerEnumType(UserRole, {
  name: 'UserRole'
})
