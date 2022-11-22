import { Resolver, Subscription } from '@nestjs/graphql'
import { Notify } from './entities/notify.entity'
import ChanelEnum from '@apollo/chanel.enum'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PUB_SUB } from '@apollo/pubsub.module'
import { Inject, Logger, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@decorators/user.decorator'
import { UserDocument } from '@app/users/entities/user.entity'
import { SubscriptionGuard } from '../../guards/subscription.guard'

@Resolver(() => Notify)
export class NotifyResolver {
  private readonly logger = new Logger(NotifyResolver.name)

  constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  @Subscription(() => Notify, {
    description: 'Nhận thông báo',
    filter: ({ subNotify }, variables, { user }) => {
      return subNotify.user?.id === user?.id
    }
  })
  @UseGuards(SubscriptionGuard)
  async subNotify(@CurrentUser() user: UserDocument) {
    this.logger.log(`subNotify: ${user._id}`)
    return this.pubSub.asyncIterator(ChanelEnum.NOTIFY)
  }
}
