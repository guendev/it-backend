import { ValidationError, ValidationPipe } from '@nestjs/common'
import { UserInputError } from 'apollo-server-express'

export class InputValidator extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const _errorsBuilder = (_errors: ValidationError[]) => {
          return _errors.reduce((rv, x) => {
            ;(rv[x.property] = rv[x.property] || []).push(
              x.constraints ? x.constraints : _errorsBuilder(x.children)
            )
            return rv
          }, {} as ValidationError)
        }

        const _errors = _errorsBuilder(errors)

        return new UserInputError('Đầu vào không hợp lệ', _errors)
      }
    })
  }
}
