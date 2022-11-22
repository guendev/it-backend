import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '@app/auth/auth.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected authService: AuthService,
    protected configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException()
    }
    const user = await this.authService.JWTVerify(payload.id)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
