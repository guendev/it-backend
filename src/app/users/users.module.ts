import { forwardRef, Global, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserEntity } from '@app/users/entities/user.entity'
import { UserController } from '@app/users/user.controller'
import { AuthModule } from '@app/auth/auth.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersResolver, UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule {}
