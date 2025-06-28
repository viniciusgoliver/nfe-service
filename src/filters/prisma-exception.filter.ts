import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException } from '@nestjs/common'
import { type Response } from 'express'

@Catch(HttpException)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString()
    })
  }
}
