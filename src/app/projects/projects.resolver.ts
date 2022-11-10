import { FilterQuery, Types } from 'mongoose'
import {
  Args,
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
import { GetProjectsFilter } from '@app/projects/filters/get-projects.filter'
import { ProjectActive } from '@app/projects/enums/project.active.enum'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { UsersService } from '@app/users/users.service'

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly categoriesService: CategoriesService,
    private readonly technologiesService: TechnologiesService,
    private readonly stepsService: StepService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Project)
  @UseGuards(FirebaseAuthGuard)
  async createProject(
    @Args('input', new InputValidator()) input: CreateProjectInput,
    @CurrentUser() user
  ) {
    console.log(user)

    const [category, technologies] = await Promise.all([
      this.getCategory(input.category),
      this.getTechs(input.technologies)
    ])
    return this.projectsService.create(user, {
      ...input,
      technologies: technologies.map((technology) => technology._id),
      category: category._id
    })
  }

  @Query(() => [Project], { name: 'projects' })
  async find(@Args('filter', new InputValidator()) filter: GetProjectsFilter) {
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
    if (filter.status) {
      _filter.status = filter.status
    }

    _filter.active = ProjectActive.ACTIVE
    return this.projectsService.findAll(_filter, filter)
  }

  @Query(() => Project, { name: 'project' })
  async findOne(@Args('project') slug: string) {
    return this.projectsService.findOne({ slug })
  }

  @Mutation(() => Project)
  async updateProject(@Args('input') input: UpdateProjectInput) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_project) throw new NotFoundError('Project not found')
    // Todo: check permission

    const [category, technologies] = await Promise.all([
      this.getCategory(input.category),
      this.getTechs(input.technologies)
    ])

    return this.projectsService.update(_project, {
      ...input,
      technologies: technologies.map((technology) => technology._id),
      category: category._id
    })
  }

  @Mutation(() => Project)
  async removeProject(
    @Args('input', new InputValidator()) input: RemoveProjectInput
  ) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_project) throw new NotFoundError('Project not found')
    // Todo: check permission
    return this.projectsService.remove(_project)
  }

  // Graphql field resolver
  @ResolveField()
  async steps(@Parent() author: Project) {
    return this.stepsService.findMany({
      project: new Types.ObjectId(author.id)
    })
  }

  @ResolveField()
  async roles(@Parent() author: Project) {
    return this.stepsService.findMany({
      project: new Types.ObjectId(author.id)
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

  // Helper
  async getCategory(_id: string | Types.ObjectId) {
    const category = await this.categoriesService.findOne({
      _id: new Types.ObjectId(_id)
    })
    if (!category) throw new Error('Category not found')
    return category
  }

  async getTechs(_ids: (string | Types.ObjectId)[]) {
    return this.technologiesService.findMany({
      _id: {
        $in: _ids.map((id) => new Types.ObjectId(id))
      }
    })
  }
}
