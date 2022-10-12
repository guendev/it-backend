import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsResolver } from './projects.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { TechnologiesModule } from '@app/technologies/technologies.module'
import { Project, ProjectEntity } from '@app/projects/entities/project.entity'
import { PlatformsModule } from '@app/platforms/platforms.module'
import { CategoriesModule } from '@app/categories/categories.module'

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
    PlatformsModule,
    CategoriesModule
  ],
  providers: [ProjectsResolver, ProjectsService]
})
export class ProjectsModule {}
