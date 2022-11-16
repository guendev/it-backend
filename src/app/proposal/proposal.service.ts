import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import {
  Proposal,
  ProposalDocument
} from '@app/proposal/entities/proposal.entity'
import { ProjectDocument } from '@app/projects/entities/project.entity'
import { ProjectsService } from '@app/projects/projects.service'

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel(Proposal.name) private model: Model<ProposalDocument>,
    private readonly projectsService: ProjectsService
  ) {}

  async create(doc: Partial<Omit<Proposal, 'role' | 'user' | 'id'>>) {
    return this.model.create({
      ...doc,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async find(project: ProjectDocument) {
    return this.model.find({ project: project._id }).sort({
      createdAt: -1
    })
    //.aggregate([
    //   {
    //     $lookup: {
    //       from: 'roles',
    //       localField: 'role',
    //       foreignField: '_id',
    //       as: 'role'
    //     }
    //   },
    //   {
    //     $unwind: '$role'
    //   },
    //   {
    //     $match: {
    //       'role.project': project._id
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'user',
    //       foreignField: '_id',
    //       as: 'user'
    //     }
    //   },
    //   {
    //     $unwind: '$user'
    //   },
    //   {
    //     $addFields: {
    //       id: { $toString: '$_id' },
    //       'role.id': { $toString: '$role._id' },
    //       'user.id': { $toString: '$user._id' }
    //     }
    //   }
    // ])
  }

  async findOne(filter: FilterQuery<ProposalDocument>) {
    return this.model.findOne(filter)
  }

  async update(proposal: ProposalDocument, doc: Partial<Omit<Proposal, 'id'>>) {
    return this.model.findByIdAndUpdate(
      proposal._id,
      {
        ...doc,
        updatedAt: Date.now()
      },
      { new: true }
    )
  }

  async remove(filter: FilterQuery<ProposalDocument>) {
    return this.model.findOneAndDelete(filter)
  }
}
