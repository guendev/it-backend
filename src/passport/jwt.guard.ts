import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // dù là request thường đều có thể tạo graphql context
    const req: Request = GqlExecutionContext.create(context).getContext().req
    if (req.cookies && req.cookies._token) {
      req.headers.authorization = 'Bearer ' + req.cookies._token
    }
    return req
  }
}
