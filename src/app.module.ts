import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FirebaseAuthStrategy } from '@passport/firebase-auth.strategy'
import { ApolloModule } from '@apollo/apollo.module'
import { UsersModule } from '@app/users/users.module'
import { DatabaseModule } from './database/database.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NotifyModule } from '@app/notify/notify.module'
import { ConfigModule } from '@nestjs/config'
import { PubSubModule } from '@apollo/pubsub.module'
import { CategoriesModule } from '@app/categories/categories.module'
import { UploadModule } from '@app/upload/upload.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
      exclude: ['/graphql*']
    }),
    ApolloModule,
    UsersModule,
    DatabaseModule,
    DatabaseModule,
    NotifyModule,
    PubSubModule,
    CategoriesModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy]
})
export class AppModule {}
