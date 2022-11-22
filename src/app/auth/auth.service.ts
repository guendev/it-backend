import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { Types } from 'mongoose'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(input: any) {
    const user = await this.usersService.findOne({ _id: input._id })
    return this.JWTGenerator(user)
  }

  async validateUser(filter: object, password: string) {
    // const user = await this.usersService.findOne(filter)
    // if (user && (await this.isMatchPassword(password, user.password))) {
    //   return user
    // }
  }

  async JWTVerify(id: Types.ObjectId): Promise<any> {
    return this.usersService.findOne({ _id: id })
  }

  async JWTGenerator(user: User) {
    const payload = { id: user.id }
    return this.jwtService.sign(payload)
  }

  async isMatchPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  }

  async checkToken(token: string) {
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(
          token.replace('Bearer ', '').trim()
        )
        return this.JWTVerify(payload.id)
      } catch (e) {}
    }
  }
}
