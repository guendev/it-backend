import { Controller, Get, Post, UseGuards } from '@nestjs/common'

import { FirebaseGuard } from '@passport/firebase.guard'
import { UsersService } from '@app/users/users.service'
import { CurrentUser } from '@decorators/user.decorator'
import { User } from '@app/users/entities/user.entity'
import { AuthService } from '@app/auth/auth.service'
import { JWTAuthGuard } from '@passport/jwt.guard'

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('auth')
  @UseGuards(FirebaseGuard)
  async auth(@CurrentUser() user: User) {
    const token = await this.authService.JWTGenerator(user)
    return {
      token
    }
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  async me(@CurrentUser() user: User) {
    return user
  }
}
