import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const prefix = configService.get('PREFIX')
  const config = new DocumentBuilder()
    .setTitle('Shoes shop')
    .setDescription('The Shoes shop API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();
  app.use(express.static("."))
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));



  await app.listen(port);
}
bootstrap();
