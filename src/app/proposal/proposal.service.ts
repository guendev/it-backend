import { Injectable } from '@nestjs/common'
import { CreateProposalInput } from './dto/create-proposal.input'
import { UpdateProposalInput } from './dto/update-proposal.input'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  Proposal,
  ProposalDocument
} from '@app/proposal/entities/proposal.entity'
import { UserDocument } from '@app/users/entities/user.entity'
import { RoleDocument } from '@app/roles/entities/role.entity'

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel(Proposal.name) private model: Model<ProposalDocument>
  ) {}

  async create(
    user: UserDocument,
    role: RoleDocument,
    input: Partial<Omit<Proposal, 'role' | 'user' | 'id'>>
  ) {
    return this.model.create({
      ...input,
      user: user._id,
      role: role._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  findAll() {
    return `This action returns all proposal`
  }

  findOne(id: number) {
    return `This action returns a #${id} proposal`
  }

  update(id: number, updateProposalInput: UpdateProposalInput) {
    return `This action updates a #${id} proposal`
  }

  remove(id: number) {
    return `This action removes a #${id} proposal`
  }
}
