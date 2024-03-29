import { FilterQuery, Types } from 'mongoose'
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { Project, ProjectDocument } from './entities/project.entity'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { InputValidator } from '@shared/validator/input.validator'
import { CategoriesService } from '@app/categories/categories.service'
import { TechnologiesService } from '@app/technologies/technologies.service'
import { StepService } from '@app/step/step.service'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveProjectInput } from '@app/projects/dto/remove-project.input'
import {
  GetMyProjectsFilter,
  GetProjectsFilter
} from '@app/projects/filters/get-projects.filter'
import { ProjectActive } from '@app/projects/enums/project.active.enum'
import { Inject, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@decorators/user.decorator'
import { UsersService } from '@app/users/users.service'
import { RolesService } from '@app/roles/roles.service'
import { ProjectStatus } from '@app/projects/enums/project.status.enum'
import { ExampleProjectsFilter } from '@app/projects/filters/example-projects.filter'
import { CountProjectsFilter, StudioCountProjectsFilter } from "@app/projects/filters/count-projects.filter";
import { GetProjectFilter } from '@app/projects/filters/get-project.filter'
import { ApproveProjectInput } from '@app/projects/dto/approve-project.input'
import { PermissionEnum } from '@app/roles/enums/role.enum'
import { JWTAuthGuard } from '@guards/jwt.guard'
import { TechnologyDocument } from '@app/technologies/entities/technology.entity'
import { PUB_SUB } from '@apollo/pubsub.module'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import ChanelEnum from '@apollo/chanel.enum'

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly categoriesService: CategoriesService,
    private readonly technologiesService: TechnologiesService,
    private readonly stepsService: StepService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Mutation(() => Project)
  @UseGuards(JWTAuthGuard)
  async createProject(
    @Args('input', new InputValidator()) input: CreateProjectInput,
    @CurrentUser() user
  ) {
    const [category, technologies] = await Promise.all([
      this.getCategory(input.category),
      this.getTechs(input.technologies)
    ])
    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Tạo thành công' }
    })
    return this.projectsService.create(user, {
      ...input,
      technologies: technologies.map((technology) => technology._id),
      category: category._id
    })
  }

  @Query(() => [Project], { name: 'projects' })
  async find(@Args('filter', new InputValidator()) filter: GetProjectsFilter) {
    const _filter: FilterQuery<ProjectDocument> = this.getBasicFilter(filter)
    _filter.active = ProjectActive.ACTIVE
    return this.projectsService.find(_filter, filter)
  }

  @Query(() => Int)
  async projectsCount(
    @Args('filter', new InputValidator()) filter: CountProjectsFilter
  ) {
    const _filter: FilterQuery<ProjectDocument> = this.getBasicFilter(filter)
    _filter.active = ProjectActive.ACTIVE
    return this.projectsService.count(_filter)
  }

  @Query(() => [Project])
  async exampleProjects(
    @Args('filter', new InputValidator()) filter: ExampleProjectsFilter
  ) {
    const _filter: FilterQuery<ProjectDocument> = this.getBasicFilter(filter)
    const _match: FilterQuery<ProjectDocument> = {
      active: ProjectActive.ACTIVE
    }
    if (_filter.length > 0) {
      _match.$or = [...Object.values(_filter)]
    }
    _match._id = { $nin: filter.exclude.map((id) => new Types.ObjectId(id)) }
    return this.projectsService.example(_match, filter.limit)
  }

  @Query(() => Project, { name: 'project' })
  async findOne(@Args('project') slug: string) {
    return this.projectsService.findOne({ slug })
  }

  @Mutation(() => Project)
  @UseGuards(JWTAuthGuard)
  async updateProject(
    @Args('input') input: UpdateProjectInput,
    @CurrentUser() user
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_project) throw new NotFoundError('Project not found')
    // Todo: check admin permission
    // Skip validate when if user is project owner
    if (user._id.toString() !== _project.owner.toString()) {
      // check role
      const _role = await this.rolesService.findOne({
        project: _project._id,
        user: user._id,
        permissions: PermissionEnum.UPDATE_PROJECT
      })
      if (!_role) throw new NotFoundError('Permission denied')
    }

    const [category, technologies] = await Promise.all([
      this.getCategory(input.category),
      this.getTechs(input.technologies)
    ])
    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Cập nhật thành công' }
    })
    return this.projectsService.update(_project, {
      ...input,
      technologies: technologies.map((technology) => technology._id),
      category: category._id
    })
  }

  @Mutation(() => Project)
  @UseGuards(JWTAuthGuard)
  async removeProject(
    @Args('input', new InputValidator()) input: RemoveProjectInput,
    @CurrentUser() user
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_project) throw new NotFoundError('Project not found')

    // Todo: check admin permission

    if (
      user._id.toString() !== _project.owner.toString() &&
      !this.usersService.isAdmin(user)
    ) {
      // check role
      const _role = await this.rolesService.findOne({
        project: _project._id,
        user: user._id,
        permissions: PermissionEnum.REMOVE_PROJECT
      })
      if (!_role) throw new NotFoundError('Permission denied')
    }

    await this.pubSub.publish(ChanelEnum.NOTIFY, {
      subNotify: { user, msg: 'Xoá thành công' }
    })

    return this.projectsService.remove(_project)
  }

  // Graphql field resolver
  @ResolveField()
  async category(@Parent() author: Project) {
    return this.categoriesService.findOne({
      _id: new Types.ObjectId(author.category as unknown as string)
    })
  }

  @ResolveField()
  async technologies(@Parent() author: Project) {
    return this.technologiesService.find({
      _id: {
        $in: author.technologies.map(
          (id) => new Types.ObjectId(id as unknown as string)
        )
      }
    })
  }

  @ResolveField()
  async steps(@Parent() author: Project) {
    return this.stepsService.find({
      project: new Types.ObjectId(author.id)
    })
  }

  @ResolveField()
  async roles(@Parent() project: Project) {
    return this.rolesService.find({
      project: new Types.ObjectId(project.id)
    })
  }

  @ResolveField()
  async owner(@Parent() author: Project) {
    return this.usersService.findOne({ _id: author.owner })
  }

  @ResolveField()
  async bookmarks(@Parent() author: Project) {
    return 0
  }

  @ResolveField()
  async comments(@Parent() author: Project) {
    return 0
  }

  // Studio
  @Query(() => [Project])
  @UseGuards(JWTAuthGuard)
  async studioProjects(
    @Args('filter', new InputValidator()) filter: GetMyProjectsFilter,
    @CurrentUser() user
  ) {
    // Todo: check admin, permission
    const _filter: FilterQuery<ProjectDocument> = this.getBasicFilter(filter)

    // admin can skip permission check
    if (!this.usersService.isAdmin(user)) {
      const roles = await this.rolesService.find({ user: user._id })
      // Find projects by owner or roles
      _filter.$or = [
        { owner: user._id },
        { _id: { $in: roles.map((role) => role.project) } }
      ]
    }

    if (filter.active.length) {
      _filter.active = { $in: filter.active }
    }
    return this.projectsService.find(_filter, filter)
  }

  @Query(() => Project)
  @UseGuards(JWTAuthGuard)
  async studioProject(
    @Args('filter', new InputValidator()) filter: GetProjectFilter,
    @CurrentUser() user
  ) {
    // Todo: check admin, permission
    const _filter: FilterQuery<ProjectDocument> = {}
    // admin can skip permission check
    if (!this.usersService.isAdmin(user)) {
      _filter.owner = user._id
    }
    _filter._id = new Types.ObjectId(filter.id)
    return this.projectsService.findOne(_filter)
  }

  @Query(() => Int)
  @UseGuards(JWTAuthGuard)
  async studioProjectsCount(
    @Args('filter', new InputValidator()) filter: StudioCountProjectsFilter,
    @CurrentUser() user
  ) {
    // Todo: check admin, permission
    const _filter: FilterQuery<ProjectDocument> = this.getBasicFilter(filter)
    // admin can skip permission check
    if (!this.usersService.isAdmin(user)) {
      _filter.owner = user._id
    }
    if (filter.active.length) {
      _filter.active = { $in: filter.active }
    }
    return this.projectsService.count(_filter)
  }

  @Mutation(() => Project)
  async studioProjectApprove(
    @Args('input', new InputValidator()) filter: ApproveProjectInput
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(filter.id)
    })
    if (!_project) throw new NotFoundError('Project not found')
    return this.projectsService.update(_project, {
      active: filter.active
    })
  }

  // Helper
  async getCategory(_id: string | Types.ObjectId) {
    const category = await this.categoriesService.findOne({
      _id: new Types.ObjectId(_id)
    })
    if (!category) throw new Error('Category not found')
    return category
  }

  async getTechs(_ids: string[]): Promise<TechnologyDocument[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Promise.all(
      _ids.map(
        (_id) =>
          new Promise((resolve, reject) => {
            if (Types.ObjectId.isValid(_id)) {
              this.technologiesService
                .findOne({ _id: new Types.ObjectId(_id) })
                .then((technology) => {
                  if (technology) {
                    resolve(technology)
                  } else {
                    reject(new Error('Technology not found'))
                  }
                })
                .catch(reject)
            } else {
              this.technologiesService
                .findOne({
                  name: {
                    $regex: new RegExp(`^${_id}$`, 'i')
                  }
                })
                .then((record) => {
                  if (record) {
                    resolve(record)
                  } else {
                    this.technologiesService
                      .create({ name: _id })
                      .then((record) => {
                        if (record) {
                          resolve(record)
                        }
                      })
                      .catch(reject)
                  }
                })
                .catch(reject)
            }
          })
      )
    )
  }

  getBasicFilter(
    filter: Omit<GetProjectsFilter, 'sort' | 'limit' | 'offset'>
  ): FilterQuery<ProjectDocument> {
    const _filter: FilterQuery<ProjectDocument> = {}
    if (filter.category) {
      _filter.category = new Types.ObjectId(filter.category)
    }
    if (filter.technologies && filter.technologies.length) {
      _filter.technologies = {
        $in: filter.technologies.map((id) => new Types.ObjectId(id))
      }
    }
    if (filter.name) {
      _filter.name = { $regex: filter.name, $options: 'i' }
    }
    if (
      [
        ProjectStatus.PREPARE,
        ProjectStatus.DONE,
        ProjectStatus.RUNNING,
        ProjectStatus.STUCK
      ].includes(filter.status)
    ) {
      _filter.status = filter.status
    }
    return _filter
  }
}
