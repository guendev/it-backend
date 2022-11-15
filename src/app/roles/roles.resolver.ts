import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { RolesService } from './roles.service'
import { Role, RoleDocument } from './entities/role.entity'
import { CreateRoleInput } from './dto/create-role.input'
import { UpdateRoleInput } from './dto/update-role.input'
import { InputValidator } from '@shared/validator/input.validator'
import { ProjectsService } from '@app/projects/projects.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { SortRolesInput } from '@app/roles/dto/sort-roles.input'
import { RemoveRoleInput } from '@app/roles/dto/remove-role.input'
import { GetRolesInput } from '@app/roles/dto/get-roles.input'
import { UsersService } from '@app/users/users.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Resolver(() => Role)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private eventEmitter: EventEmitter2
  ) {}

  @Mutation(() => Role)
  async createRole(
    @Args('input', new InputValidator()) input: CreateRoleInput
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new NotFoundError('Project không tồn tại')
    }
    // Todo: check permission

    const roles = await this.rolesService.find({
      project: new Types.ObjectId(input.project)
    })

    return this.rolesService.create({
      ...input,
      project: new Types.ObjectId(input.project),
      order: roles.length + 1
    })
  }

  @Query(() => [Role], { name: 'roles' })
  async findAll(@Args('filter', new InputValidator()) input: GetRolesInput) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.project)
    })
    if (!_project) {
      throw new NotFoundError('Project không tồn tại')
    }
    return this.rolesService.find({ project: _project._id })
  }

  @Mutation(() => Role)
  async updateRole(
    @Args('input', new InputValidator()) input: UpdateRoleInput
  ) {
    /// dfd
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_role) {
      throw new NotFoundError('Role không tồn tại')
    }
    ///fdsfsd
    // Todo: check permission
    delete input.id
    ///fdsfdsf
    return this.rolesService.update(_role, input)
  }

  @Mutation(() => [Role])
  async sortRoles(@Args('input', new InputValidator()) input: SortRolesInput) {
    // Todo: check permission
    const _roles = await Promise.all<RoleDocument>(
      input.roles.map(
        (role) =>
          new Promise(async (resolve, reject) => {
            const _role = await this.rolesService.findOne({
              _id: new Types.ObjectId(role)
            })
            if (!_role) {
              reject(new NotFoundError('Role không tồn tại'))
            }
            // Todo: check permission
            resolve(_role)
          })
      )
    )

    return Promise.all<RoleDocument>(
      _roles.map(
        (role, index) =>
          new Promise((resolve, reject) => {
            this.rolesService
              .update(role, { order: index + 1 } as unknown as UpdateRoleInput)
              .then(resolve)
              .catch(reject)
          })
      )
    )
  }

  @Mutation(() => Role)
  async removeRole(
    @Args('input', new InputValidator()) input: RemoveRoleInput
  ) {
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_role) {
      throw new NotFoundError('Role không tồn tại')
    }
    // Todo: check permission
    return this.rolesService.remove(_role)
  }

  //
  @ResolveField()
  async user(@Parent() author: Role) {
    return this.usersService.findOne({ _id: author.user })
  }
}
