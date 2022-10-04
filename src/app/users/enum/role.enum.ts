import { registerEnumType } from '@nestjs/graphql'

export enum Role {
  USER = 'user',
  AUTHOR = 'author',
  ADMIN = 'admin',
  SP_ADMIN = 'sp_admin'
}

registerEnumType(Role, {
  name: 'Role'
})
