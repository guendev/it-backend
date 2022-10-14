import { Injectable } from '@nestjs/common'
import { UpdateStepInput } from './dto/update-step.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Step, StepDocument } from '@app/step/entities/step.entity'

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

  update(id: number, updateStepInput: UpdateStepInput) {
    return `This action updates a #${id} step`
  }

  remove(id: number) {
    return `This action removes a #${id} step`
  }
}
