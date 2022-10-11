import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import {
  Technology,
  TechnologyDocument
} from '@app/technologies/entities/technology.entity'
import { CreateTechnologyInput } from '@app/technologies/dto/create-technology.input'

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectModel(Technology.name) private model: Model<TechnologyDocument>
  ) {}

  async create(doc: Record<string, any>) {
    return this.model.create(doc)
  }

  async findAll(filter: FilterQuery<TechnologyDocument>) {
    return this.model.find(filter)
  }

  async findOne(filter: FilterQuery<TechnologyDocument>) {
    return this.model.findOne(filter)
  }

  async update(
    match: FilterQuery<TechnologyDocument>,
    doc: Partial<CreateTechnologyInput>
  ) {
    return this.model.findOneAndUpdate(match, doc, { new: true })
  }

  async remove(filter: FilterQuery<TechnologyDocument>) {
    return this.model.findByIdAndDelete(filter)
  }
}
