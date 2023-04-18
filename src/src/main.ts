import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import supertokens from 'supertokens-node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { SupertokensExceptionFilter } from './auth/filters/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, appName } = appConfig();

  app.setGlobalPrefix('v1');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.enableCors({
    origin: ['https://programador.ao'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API da plataforma Programador AO')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(port, () => {
    console.log(`===EXECUÇÃO DO SERVIDOR | Programador AO===`);
    console.log(`- PORT: ${port}`);
    console.log(`- AMBIENTE: ${process.env.NODE_ENV}`);
    console.log(`===========================================`);
  });
}

bootstrap();
