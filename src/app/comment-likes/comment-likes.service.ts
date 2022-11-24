import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AnyKeys, FilterQuery, Model } from 'mongoose'
import {
  CommentLike,
  CommentLikeDocument
} from '@app/comment-likes/entities/comment-like.entity'

@Injectable()
export class CommentLikesService {
  constructor(
    @InjectModel(CommentLike.name) private model: Model<CommentLikeDocument>
  ) {}

  async create(doc: AnyKeys<CommentLike>) {
    return this.model.create({
      ...doc,
      createdAt: Date.now()
    })
  }

  async findOne(filter: FilterQuery<CommentLike>) {
    return this.model.findOne(filter)
  }

  async remove(filter: FilterQuery<CommentLike>) {
    return this.model.findOneAndRemove(filter)
  }
}
