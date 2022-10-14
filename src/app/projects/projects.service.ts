import { Injectable } from '@nestjs/common'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private model: Model<ProjectDocument>
  ) {}

  async create(input: CreateProjectInput) {
    return this.model.create({
      ...input,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  findAll() {
    return `This action returns all projects`
  }

  async findOne(filter: FilterQuery<ProjectDocument>) {
    return this.model.findOne(filter)
  }

  update(id: number, updateProjectInput: UpdateProjectInput) {
    return `This action updates a #${id} project`
  }

  remove(id: number) {
    return `This action removes a #${id} project`
  }
}
