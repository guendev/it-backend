import { ExecutionContext } from '@nestjs/common'

export const UserSubscriptionExtract = (ctx: ExecutionContext) => {
  const filter = ctx
    .getArgs()
    .filter((value) => (value || {}).hasOwnProperty('user'))

  if (filter.length) {
    return filter[0]['user']
  }
}
