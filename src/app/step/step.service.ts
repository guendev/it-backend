import { Injectable } from '@nestjs/common'
import { UpdateStepInput } from './dto/update-step.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Step, StepDocument } from '@app/step/entities/step.entity'
import { CreateCategoryInput } from '@app/categories/dto/create-category.input'

@Injectable()
export class StepService {
  constructor(@InjectModel(Step.name) private model: Model<StepDocument>) {}

  async create(input: object) {
    return this.model.create({
      ...input,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  findAll() {
    return `This action returns all step`
  }

  async findOne(filter: FilterQuery<StepDocument>) {
    return this.model.findOne(filter)
  }

  async findMany(filter: FilterQuery<StepDocument>) {
    return this.model.find(filter).sort({ order: 1, _id: 1 })
  }

  async update(
    match: FilterQuery<StepDocument>,
    doc: Partial<Pick<StepDocument, 'name' | 'status' | 'order'>>
  ) {
    return this.model.findOneAndUpdate(
      match,
      {
        ...doc,
        updatedAt: Date.now()
      },
      { new: true }
    )
  }

  remove(id: number) {
    return `This action removes a #${id} step`
  }
}
