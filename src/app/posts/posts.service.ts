import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AnyKeys, FilterQuery, Model } from 'mongoose'
import { Post, PostDocument } from '@app/posts/entities/post.entity'
import { FilterOffet } from '@shared/args/filter-offset.input'

@Injectable()
export class PostsService {
  @InjectModel(Post.name) private model: Model<Post>

  async create(doc: AnyKeys<Post>) {
    return this.model.create({
      ...doc,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async find(filter: FilterQuery<Post>, options: FilterOffet) {
    return this.model
      .find(filter)
      .sort({ [options.sort]: -1 })
      .skip(options.offset)
      .limit(options.limit)
  }

  async findOne(filter: FilterQuery<Post>) {
    return this.model.findOne(filter)
  }

  async update(post: PostDocument, doc: AnyKeys<Post>) {
    return this.model.findByIdAndUpdate(post.id, doc, { new: true })
  }

  async remove(filter: FilterQuery<Post>) {
    return this.model.findOneAndRemove(filter)
  }
}
