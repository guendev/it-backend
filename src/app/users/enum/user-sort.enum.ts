import { registerEnumType } from '@nestjs/graphql';

export enum UserSortEnum {
  CREATED_AT = 'createdAt',
}

registerEnumType(UserSortEnum, {
  name: 'UserSort',
});
