import { Injectable } from '@nestjs/common'
import { UpdateRoleInput } from './dto/update-role.input'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Role, RoleDocument } from '@app/roles/entities/role.entity'

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private model: Model<RoleDocument>) {}

  async create(
    input: Pick<Role, 'name' | 'permissions' | 'order' | 'project'>
  ) {
    return this.model.create({
      ...input,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async find(filter: FilterQuery<RoleDocument>) {
    return this.model.find(filter)
  }

  async findOne(filter: FilterQuery<RoleDocument>) {
    return this.model.findOne(filter)
  }

  async update(role: RoleDocument, doc: Omit<UpdateRoleInput, 'id'>) {
    return this.model.findByIdAndUpdate(
      role._id,
      {
        ...doc,
        updatedAt: Date.now()
      },
      { new: true }
    )
  }

  async remove(role: RoleDocument) {
    return this.model.findByIdAndDelete(role._id)
  }
}
