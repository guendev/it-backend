import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserDocument } from '@app/users/entities/user.entity'

export interface FirebaseUser {
  uid: string
  email: string
}
export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<UserDocument> => {
    const ctx = GqlExecutionContext.create(context).getContext()
    if (ctx.isSubscription) {
      return ctx.user
    }
    return ctx.req.user
  }
)
