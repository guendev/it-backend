import { forwardRef, Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsResolver } from './projects.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { TechnologiesModule } from '@app/technologies/technologies.module'
import { Project, ProjectEntity } from '@app/projects/entities/project.entity'
import { CategoriesModule } from '@app/categories/categories.module'
import { StepModule } from '@app/step/step.module'
import { RolesModule } from '@app/roles/roles.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Project.name,
        useFactory: () => {
          const schema = ProjectEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ]),
    TechnologiesModule,
    CategoriesModule,
    forwardRef(() => StepModule),
    forwardRef(() => RolesModule)
  ],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
