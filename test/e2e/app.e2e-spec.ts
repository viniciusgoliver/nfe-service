import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { MockAppModule } from '../mock/mock-mailer.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Health Check is OK')
  })
})
