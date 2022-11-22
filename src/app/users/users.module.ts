import { Global, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserEntity } from '@app/users/entities/user.entity'
import { UserController } from '@app/users/user.controller'

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
    ])
  ],
  providers: [UsersResolver, UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule {}
