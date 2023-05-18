import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import {
  ForbiddenException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { PrismaService } from './database/prisma/prisma.service';

async function bootstrap() {
  const { port, appName, apiVersion, listaBranca, environment } = appConfig();
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    logger: environment === 'production' ? ['error', 'warn'] : undefined,
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: (origin, callback) => {
      if (listaBranca.includes(origin) || !origin) callback(null, true);
      else throw new ForbiddenException(`${origin} - Não autorizado pelo CORS`);
    },
    credentials: true,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.enableVersioning({
    defaultVersion: apiVersion,
    type: VersioningType.URI,
    prefix: 'v',
  });

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API da plataforma Programador AO')
    .setVersion(`v${apiVersion}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(port);
}

bootstrap();
