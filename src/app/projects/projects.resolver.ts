import { Types } from 'mongoose'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { Project } from './entities/project.entity'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { InputValidator } from '@shared/validator/input.validator'
import { CategoriesService } from '@app/categories/categories.service'
import { TechnologiesService } from '@app/technologies/technologies.service'
import { StepService } from '@app/step/step.service'
import { NotFoundError } from '@shared/errors/not-found.error'
import { RemoveProjectInput } from '@app/projects/dto/remove-project.input'

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly categoriesService: CategoriesService,
    private readonly technologiesService: TechnologiesService,
    private readonly stepsService: StepService
  ) {}

  @Mutation(() => Project)
  async createProject(
    @Args('input', new InputValidator()) input: CreateProjectInput
  ) {
    const [category, technologies] = await Promise.all([
      this.getCategory(input.category),
      this.getTechs(input.technologies)
    ])
    return this.projectsService.create({
      ...input,
      technologies: technologies.map((technology) => technology._id),
      category: category._id
    })
  }

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectsService.findAll()
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
