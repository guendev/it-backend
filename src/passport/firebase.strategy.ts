import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-firebase-jwt'
import { UsersService } from '@app/users/users.service'
import { UserDocument } from '@app/users/entities/user.entity'
import { FirebaseService } from '@app/firebase/firebase.service'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth'
) {
  private readonly logger = new Logger(FirebaseStrategy.name)

  constructor(protected usersService: FirebaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }
  async validate(token: string) {
    const user: UserDocument | void =
      await this.usersService.verifyFirebaseToken(token)
    if (!user) {
      throw new UnauthorizedException()
    }
    this.logger.log(`User: ${user.name} has been successfully logged in`)
    return user
  }

  authenticate(req: any, options: any): any {
    return super.authenticate(req, options)
  }
}
