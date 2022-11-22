import { Controller, Post, UseGuards } from '@nestjs/common'

import { FirebaseGuard } from '@passport/firebase.guard'
import { UsersService } from '@app/users/users.service'
import { CurrentUser } from '@decorators/user.decorator'
import { User } from '@app/users/entities/user.entity'

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth')
  @UseGuards(FirebaseGuard)
  async single(@CurrentUser() user: User) {
    console.log('user', user)
  }
}
