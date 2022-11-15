import { Injectable } from '@nestjs/common'
import { CreateProjectInput } from './dto/create-project.input'
import { UpdateProjectInput } from './dto/update-project.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'
import { FilterOffet } from '@shared/args/filter-offset.input'
import { UserDocument } from '@app/users/entities/user.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private model: Model<ProjectDocument>
  ) {}

  async create(user: UserDocument, input: CreateProjectInput) {
    return this.model.create({
      ...input,
      owner: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async find(filter: FilterQuery<ProjectDocument>, options: FilterOffet) {
    return this.model
      .find(filter)
      .sort({ [options.sort]: -1 })
      .skip(options.offset)
      .limit(options.limit)
  }

  async count(filter: FilterQuery<ProjectDocument>) {
    return this.model.countDocuments(filter)
  }

  async findOne(filter: FilterQuery<ProjectDocument>) {
    return this.model.findOne(filter)
  }

  async example(filter: FilterQuery<ProjectDocument>, size: number) {
    return this.model
      .aggregate([{ $match: filter }, { $sample: { size } }])
      .addFields({ id: { $toString: '$_id' } })
  }

  async update(project: ProjectDocument, doc: Partial<Omit<Project, 'id'>>) {
    return this.model.findByIdAndUpdate(
      project._id,
      {
        ...doc,
        updatedAt: Date.now()
      },
      { new: true }
    )
  }

  async remove(project: ProjectDocument) {
    return this.model.findByIdAndDelete(project._id)
  }
}
