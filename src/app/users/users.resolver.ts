import { Args, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User, UserDocument } from './entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { InputValidator } from '@shared/validator/input.validator'
import { GetUsersFilter } from '@app/users/filters/get-users.filter'
import { FilterQuery } from 'mongoose'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(FirebaseAuthGuard)
  getUser(@CurrentUser() user) {
    return user
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(FirebaseAuthGuard)
  async getUsers(@Args('filter', new InputValidator()) filter: GetUsersFilter) {
    const _filter: FilterQuery<UserDocument> = {}
    if (filter.name) {
      _filter.name = { $regex: filter.name, $options: 'i' }
    }
    return this.usersService.find(filter, filter)
  }
}
