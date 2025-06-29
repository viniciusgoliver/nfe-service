import { Injectable, Inject, type NestInterceptor, type CallHandler, type ExecutionContext } from '@nestjs/common'
import { Logger } from 'winston'
import { type Observable } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.log(context.switchToHttp().getRequest())
    return next.handle()
  }

  private log(req) {
    const body = { ...req.body }
    delete body.password
    delete body.passwordConfirmation
    const user = req.user
    const userEmail = user ? user.email : null
    this.logger.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        route: req.route.path,
        data: {
          body,
          query: req.query,
          params: req.params
        },
        from: req.ip,
        madeBy: userEmail
      })
    )
  }
}
