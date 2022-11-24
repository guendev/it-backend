import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AnyKeys, FilterQuery, Model } from 'mongoose'
import { Comment, CommentDocument } from '@app/comments/entities/comment.entity'
import { FilterOffet } from '@shared/args/filter-offset.input'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private model: Model<CommentDocument>
  ) {}

  async create(input: AnyKeys<Comment>) {
    return this.model.create({
      ...input,
      createdAt: Date.now()
    })
  }

  async find(filter: FilterQuery<CommentDocument>)

  async find(filter: FilterQuery<CommentDocument>, options: FilterOffet)

  async find(filter: FilterQuery<CommentDocument>, options?: FilterOffet) {
    if (options) {
      return this.model
        .find(filter)
        .sort({ [options.sort]: -1 })
        .skip(options.offset)
        .limit(options.limit)
    }
    return this.model.find(filter)
  }

  async findOne(filter: FilterQuery<CommentDocument>) {
    return this.model.findOne(filter)
  }
}
