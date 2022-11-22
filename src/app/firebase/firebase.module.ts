import { forwardRef, Module } from '@nestjs/common'
import { FirebaseService } from './firebase.service'
import { FirebaseResolver } from './firebase.resolver'
import { UsersModule } from '@app/users/users.module'

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [FirebaseResolver, FirebaseService],
  exports: [FirebaseService]
})
export class FirebaseModule {}
