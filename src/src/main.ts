import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import appConfig from './config/app.config';
import { AppModule } from './modules/app-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, appName, apiVersion } = appConfig();

  app.setGlobalPrefix(apiVersion);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API da plataforma Programador AO')
    .setVersion(apiVersion)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(port);
}

bootstrap();
