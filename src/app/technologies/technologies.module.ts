import { Module } from '@nestjs/common'
import { TechnologiesService } from './technologies.service'
import { TechnologiesResolver } from './technologies.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Technology,
  TechnologyEntity
} from '@app/technologies/entities/technology.entity'
import { PlatformsModule } from '@app/platforms/platforms.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Technology.name,
        useFactory: () => {
          const schema = TechnologyEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ]),
    PlatformsModule
  ],
  providers: [TechnologiesResolver, TechnologiesService]
})
export class TechnologiesModule {}
