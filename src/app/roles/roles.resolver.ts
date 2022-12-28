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
import { AnyKeys, Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { SortRolesInput } from '@app/roles/dto/sort-roles.input'
import { RemoveRoleInput } from '@app/roles/dto/remove-role.input'
import { GetRolesInput } from '@app/roles/dto/get-roles.input'
import { UsersService } from '@app/users/users.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import ChanelEnum from '@apollo/chanel.enum'
import { Inject, UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { PUB_SUB } from '@apollo/pubsub.module'
import { RedisPubSub } from 'graphql-redis-subscriptions'

@Resolver(() => Role)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private eventEmitter: EventEmitter2,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Mutation(() => [Role])
  @UseGuards(JWTAuthGuard)
  async createRole(
    @Args('input', new InputValidator()) input: CreateRoleInput,
    @CurrentUser() user
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

    const inputs: AnyKeys<Role>[] = Array(input.count)
      .fill({
        project: _project._id,
        name: input.name,
        permissions: input.permissions,
        group: Math.round(Math.random() * 10000000)
      })
      .map((item, index) => ({
        ...item,
        order: roles.length + index + 1
      }))

    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Tạo thành công' }
    })
    return this.rolesService.create(inputs)
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
  @UseGuards(JWTAuthGuard)
  async updateRole(
    @Args('input', new InputValidator()) input: UpdateRoleInput,
    @CurrentUser() user
  ) {
    const getInput = <T extends Record<string, any>>(
      input: T,
      exclude: (keyof T)[]
    ) => {
      return Object.entries(input).reduce((acc, [key, value]) => {
        if (value && !exclude.includes(key as keyof T)) {
          acc[key] = value
        }
        return acc
      }, {} as any)
    }

    /// dfd
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_role) {
      throw new NotFoundError('Role không tồn tại')
    }

    const doc: AnyKeys<Role> = getInput(input, ['id', 'user'])

    if (input.user) {
      const _user = await this.usersService.findOne({
        _id: new Types.ObjectId(input.user)
      })
      if (!_user) {
        throw new NotFoundError('User không tồn tại')
      }
      doc.user = _user._id
    }

    ///fdsfsd
    // Todo: check permission
    // Todo: check lại role này có user chưa
    // Todo: User ko dc phép điền trường user
    doc.group = Math.round(Math.random() * 10000000)

    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Cập nhật thành công' }
    })
    ///fdsfdsf
    return this.rolesService.update(_role, doc)
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
  @UseGuards(JWTAuthGuard)
  async removeRole(
    @Args('input', new InputValidator()) input: RemoveRoleInput,
    @CurrentUser() user
  ) {
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_role) {
      throw new NotFoundError('Role không tồn tại')
    }
    // Todo: check permission
    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Xoá thành công' }
    })
    return this.rolesService.remove(_role)
  }

  //
  @ResolveField()
  async user(@Parent() author: Role) {
    return this.usersService.findOne({ _id: author.user })
  }
}
