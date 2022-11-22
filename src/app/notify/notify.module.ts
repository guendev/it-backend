import { Module } from '@nestjs/common'
import { NotifyResolver } from './notify.resolver'

@Module({
  providers: [NotifyResolver]
})
export class NotifyModule {}
