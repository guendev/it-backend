import { forwardRef, Module } from '@nestjs/common'
import { PlatformsService } from './platforms.service'
import { PlatformsResolver } from './platforms.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Platform,
  PlatformEntity
} from '@app/platforms/entities/platform.entity'
import { TechnologiesModule } from '@app/technologies/technologies.module'

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
    ]),
    forwardRef(() => TechnologiesModule)
  ],
  providers: [PlatformsResolver, PlatformsService],
  exports: [PlatformsService]
})
export class PlatformsModule {}
