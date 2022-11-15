import { forwardRef, Module } from '@nestjs/common'
import { StepService } from './step.service'
import { StepResolver } from './step.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Step, StepEntity } from '@app/step/entities/step.entity'
import { ProjectsModule } from '@app/projects/projects.module'
import { StepEvent } from '@app/step/step.event'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Step.name,
        useFactory: () => {
          return StepEntity
        }
      }
    ]),
    forwardRef(() => ProjectsModule)
  ],
  providers: [StepResolver, StepService, StepEvent],
  exports: [StepService]
})
export class StepModule {}
