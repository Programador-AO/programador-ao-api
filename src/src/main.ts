import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app-module';
import appConfig from './config/app.config';
import { PrismaService } from './database/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, appName, apiVersion } = appConfig();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

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
