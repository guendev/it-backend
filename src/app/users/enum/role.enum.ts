import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
  USER = 'user',
  AUTHOR = 'author',
  ADMIN = 'admin',
  SP_ADMIN = 'sp_admin'
}

registerEnumType(UserRole, {
  name: 'UserRole'
})
