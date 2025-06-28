import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { environmentConfig } from './configs';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

const environment = JSON.parse(JSON.stringify(environmentConfig()));

function generateSwaggerFile(app: INestApplication): void {
  const options = new (DocumentBuilder as any)().addBearerAuth();
  options.setTitle(environment.app.name);
  options.setDescription(environment.app.description);
  options.setVersion(environment.app.version);
  options.addServer(environment.app.url);
  options.setContact('Vinícius G. Oliveira', '', 'vinicius.oliver@gmail.com');

  const document = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api/docs', app, document);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });    

  if ('true' == environment.app.swaggerDocumentation) {
    generateSwaggerFile(app);
  }

  await app
    .listen(environment.app.port)
    .then(() => {
      console.log(`Server started on port ${environment.app.port}`);
    })
    .catch((error) => {
      console.error(`An error occurred: ${error}`);
    });
}
bootstrap();
