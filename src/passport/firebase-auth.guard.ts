import { ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IS_PUBLIC_KEY, IS_TEST_USER_KEY } from '@decorators/public.decorator'
import { Observable } from 'rxjs'
import { User } from '@app/users/entities/user.entity'
import { Types } from 'mongoose'

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-auth') {
  private readonly logger = new Logger(FirebaseAuthGuard.name)

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = this.getRequest(context)
    // Request bình thường
    if (req) {
      return super.canActivate(context)
    }
    // Subscription user
    const ctx = GqlExecutionContext.create(context).getContext()
    return !!ctx?.user
  }

  getRequest(context: ExecutionContext) {
    /**
     * nếu từ subscription thì ctx sẽ ko có req và có user
     */
    const ctx = GqlExecutionContext.create(context).getContext()
    if (ctx.isSubscription)
      return {
        headers: {
          authorization: ctx._token
        }
      }
    return ctx.req
  }

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    if (user) return user

    const isTestUser = this.reflector.getAllAndOverride<boolean>(
      IS_TEST_USER_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (isTestUser) {
      this.logger.debug('Fallback test user: ' + 'awagmJPhJuNuodV99vO3mVXDDMH3')
      return {
        uid: 'awagmJPhJuNuodV99vO3mVXDDMH3',
        _id: new Types.ObjectId('62c798b92baae3f41f41dde3')
      } as unknown as User
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return user
    }
    return super.handleRequest(err, user, info, context, status)
  }
}
