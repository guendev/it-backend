import { Module } from '@nestjs/common'
import { TechnologiesService } from './technologies.service'
import { TechnologiesResolver } from './technologies.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Technology,
  TechnologyEntity
} from '@app/technologies/entities/technology.entity'

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
    ])
  ],
  providers: [TechnologiesResolver, TechnologiesService],
  exports: [TechnologiesService]
})
export class TechnologiesModule {}
