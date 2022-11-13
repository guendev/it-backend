import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
  USER,
  SP_ADMIN
}

registerEnumType(UserRole, {
  name: 'UserRole'
})
