import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHelathCheck(): string {
    const message = 'Health Check is OK'

    return message
  }
}
