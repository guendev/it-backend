import { Injectable } from '@nestjs/common'
import { CreatePlatformInput } from './dto/create-platform.input'
import { UpdatePlatformInput } from './dto/update-platform.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import {
  Platform,
  PlatformDocument
} from '@app/platforms/entities/platform.entity'

@Injectable()
export class PlatformsService {
  constructor(
    @InjectModel(Platform.name) private model: Model<PlatformDocument>
  ) {}

  async create(input: CreatePlatformInput) {
    return this.model.create(input)
  }

  async findAll() {
    return this.model.find()
  }

  async findOne(filter: FilterQuery<PlatformDocument>) {
    return this.model.findOne(filter)
  }

  async update(
    match: FilterQuery<PlatformDocument>,
    doc: Partial<CreatePlatformInput>
  ) {
    return this.model.findOneAndUpdate(match, doc, { new: true })
  }

  remove(id: number) {
    return `This action removes a #${id} platform`
  }
}
