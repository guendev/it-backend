import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { Types } from 'mongoose'

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name)

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(input: any) {
    const user = await this.usersService.findOne({ _id: input._id })
    return this.JWTGenerator(user)
  }

  async JWTVerify(id: Types.ObjectId): Promise<any> {
    return this.usersService.findOne({ _id: id })
  }

  async JWTGenerator(user: User) {
    const payload = { id: user.id }
    return this.jwtService.sign(payload)
  }

  async checkToken(token: string) {
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(
          token.replace('Bearer ', '').trim(),
        )
        return this.JWTVerify(payload.id)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
