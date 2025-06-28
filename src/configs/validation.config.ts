import * as Joi from 'joi'

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().default('NestApplication'),
  APP_DESCRIPTION: Joi.string().default('NestApplication'),
  APP_VERSION: Joi.string().required(),
  APP_URL: Joi.string().required(),
  PORT: Joi.number().default(3000),

  LOG_LEVEL: Joi.string(),
  LOG_FILE_NAME: Joi.string(),

  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number()
})
