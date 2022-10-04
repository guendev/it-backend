import { Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { CurrentUser } from '@decorators/user.decorator'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(FirebaseAuthGuard)
  getUser(@CurrentUser() user) {
    return user
  }
}
