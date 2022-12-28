import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { FilterQuery, Model } from 'mongoose'
import { auth } from 'firebase-admin'
import { FilterOffet } from '@shared/args/filter-offset.input'
import { UserRole } from '@app/users/enum/role.enum'

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService')

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: auth.UserRecord) {
    this.logger.log(`Creating a new user: ${user.displayName}`)
    return this.userModel.create({
      name: user.displayName || 'Anonymous',
      email: user.email,
      uid: user.uid,
      createdAt: Date.now()
    })
  }

  async find(filter: FilterQuery<UserDocument>)

  async find(filter: FilterQuery<UserDocument>, options: FilterOffet)

  async find(filter: FilterQuery<UserDocument>, options?: FilterOffet) {
    if (options) {
      return this.userModel
        .find(filter)
        .sort({ [options.sort]: -1 })
        .skip(options.offset)
        .limit(options.limit)
    }
    return this.userModel.find(filter)
  }

  async findOne(filter: FilterQuery<UserDocument>) {
    // Todo: upsert user
    return this.userModel.findOne(filter)
  }

  isAdmin(user: UserDocument) {
    return [UserRole.SP_ADMIN, UserRole.ADMIN].includes(user.role)
  }
}
