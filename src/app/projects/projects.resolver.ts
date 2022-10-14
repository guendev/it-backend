import { Types } from 'mongoose'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { ProjectsService } from './projects.service'
import { Project } from './entities/project.entity'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { InputValidator } from '@shared/validator/input.validator'
import { CategoriesService } from '@app/categories/categories.service'
import { TechnologiesService } from '@app/technologies/technologies.service'
import { StepService } from '@app/step/step.service'

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
    const category = await this.categoriesService.findOne({
      _id: new Types.ObjectId(input.category)
    })
    if (!category) throw new Error('Category not found')

    const technologies = await this.technologiesService.findMany({
      _id: {
        $in: input.technologies.map((id) => new Types.ObjectId(id))
      }
    })

    if (technologies.length !== input.technologies.length)
      throw new Error('Platform not found')

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
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput
  ) {
    return this.projectsService.update(
      updateProjectInput.id,
      updateProjectInput
    )
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id)
  }

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
}
