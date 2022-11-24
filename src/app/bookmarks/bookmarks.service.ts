import { Injectable } from '@nestjs/common'
import { UserDocument } from '@app/users/entities/user.entity'
import { ProjectDocument } from '@app/projects/entities/project.entity'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import {
  Bookmark,
  BookmarkDocument
} from '@app/bookmarks/entities/bookmark.entity'
import { FilterOffet } from '@shared/args/filter-offset.input'

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private model: Model<BookmarkDocument>
  ) {}

  async create(
    user: Pick<UserDocument, '_id'>,
    project: Pick<ProjectDocument, '_id'>
  ) {
    return this.model.create({
      user: user._id,
      project: project._id,
      createdAt: Date.now()
    })
  }

  async find(filter: FilterQuery<BookmarkDocument>, options: FilterOffet) {
    return this.model
      .find(filter)
      .sort({ [options.sort]: -1 })
      .skip(options.offset)
      .limit(options.limit)
  }

  async findOne(filter: FilterQuery<BookmarkDocument>) {
    return this.model.findOne(filter)
  }

  async remove(filter: FilterQuery<BookmarkDocument>) {
    return this.model.findOneAndDelete(filter)
  }
}
