import { Module } from '@nestjs/common'
import { PlatformsService } from './platforms.service'
import { PlatformsResolver } from './platforms.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Platform,
  PlatformEntity
} from '@app/platforms/entities/platform.entity'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Platform.name,
        useFactory: () => {
          const schema = PlatformEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ])
  ],
  providers: [PlatformsResolver, PlatformsService]
})
export class PlatformsModule {}
