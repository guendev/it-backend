import { Module } from '@nestjs/common'
import { NotifyService } from './notify.service'
import { NotifyResolver } from './notify.resolver'

@Module({
  providers: [NotifyResolver, NotifyService]
})
export class NotifyModule {}
