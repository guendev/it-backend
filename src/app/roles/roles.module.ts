import { forwardRef, Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesResolver } from './roles.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleEntity } from '@app/roles/entities/role.entity'
import { ProjectsModule } from '@app/projects/projects.module'
import { RolesEvent } from '@app/roles/roles.event'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          return RoleEntity
        }
      }
    ]),
    forwardRef(() => ProjectsModule)
  ],
  providers: [RolesResolver, RolesService, RolesEvent],
  exports: [RolesService]
})
export class RolesModule {}
