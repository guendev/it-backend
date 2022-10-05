import { Injectable } from '@nestjs/common'
import { CreatePlatformInput } from './dto/create-platform.input'
import { UpdatePlatformInput } from './dto/update-platform.input'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
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

  findAll() {
    return `This action returns all platforms`
  }

  findOne(id: number) {
    return `This action returns a #${id} platform`
  }

  update(id: number, updatePlatformInput: UpdatePlatformInput) {
    return `This action updates a #${id} platform`
  }

  remove(id: number) {
    return `This action removes a #${id} platform`
  }
}
