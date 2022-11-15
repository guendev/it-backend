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

  async find(filter: FilterQuery<StepDocument>): Promise<StepDocument[]> {
    return this.model.find(filter).sort({
      order: 1
    })
  }

  async findOne(filter: FilterQuery<StepDocument>) {
    return this.model.findOne(filter)
  }

  async update(step: StepDocument, doc: Omit<UpdateStepInput, 'id'>) {
    return this.model.findByIdAndUpdate(
      step._id,
      {
        ...doc,
        updatedAt: Date.now()
      },
      { new: true }
    )
  }

  async remove(step: StepDocument) {
    return this.model.findByIdAndDelete(step._id)
  }
}
