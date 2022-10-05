import { Injectable } from '@nestjs/common'
import { UpdateTechnologyInput } from './dto/update-technology.input'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Technology,
  TechnologyDocument
} from '@app/technologies/entities/technology.entity'

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectModel(Technology.name) private model: Model<TechnologyDocument>
  ) {}

  async create(doc: Record<string, any>) {
    return this.model.create(doc)
  }

  findAll() {
    return `This action returns all technologies`
  }

  findOne(id: number) {
    return `This action returns a #${id} technology`
  }

  update(id: number, updateTechnologyInput: UpdateTechnologyInput) {
    return `This action updates a #${id} technology`
  }

  remove(id: number) {
    return `This action removes a #${id} technology`
  }
}
