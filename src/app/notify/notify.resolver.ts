import { Resolver, Subscription } from '@nestjs/graphql'
import { NotifyService } from './notify.service'
import { Notify } from './entities/notify.entity'
import ChanelEnum from '@apollo/chanel.enum'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PUB_SUB } from '@apollo/pubsub.module'
import { Inject, Logger, UseGuards } from '@nestjs/common'
import { FirebaseGuard } from '@passport/firebase.guard'
import { CurrentUser } from '@decorators/user.decorator'
import { UserDocument } from '@app/users/entities/user.entity'

@Resolver(() => Notify)
export class NotifyResolver {
  private readonly logger = new Logger(NotifyResolver.name)

  constructor(
    private readonly notifyService: NotifyService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Subscription(() => Notify, {
    description: 'Nhận thông báo',
    filter: ({ subNotify }, variables, { user }) => {
      return subNotify.user.uid === user.uid
    }
  })
  @UseGuards(FirebaseGuard)
  async subNotify(@CurrentUser() user: UserDocument) {
    this.logger.log(`subNotify: ${user.uid}`)
    return this.pubSub.asyncIterator(ChanelEnum.NOTIFY)
  }
}
