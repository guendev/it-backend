import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from '@app/users/users.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '3d'
        }
      }),
      inject: [ConfigService]
    }),
    forwardRef(() => UsersModule)
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
