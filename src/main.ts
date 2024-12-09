import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import {SwaggerModule, DocumentBuilder, SwaggerCustomOptions} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //swagger setup
  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: "none",
    },
  };
  SwaggerModule.setup('api', app, document, customOptions)

  //cors setup

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4002',
      'http://localhost:4001',
      'whitevape.com.ua',
      'admin.whitevape.com.ua',
      'https://whitevape.com.ua',
      'https://admin.whitevape.com.ua',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-csrf-token',
      'x-forwarded-for'
    ],
    credentials: true,
    exposedHeaders: ['*', 'Authorization', 'x-forwarded-for'],
  });

  //cookie parser setup
  app.use(cookieParser());

  //body parser setup
  const bodyParser = require("body-parser");
  app.use(bodyParser.json({ limit: "200mb" }));
  app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

  //validation setup
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    validationError: {
      target: true,
      value: true,
    }
  }));

  await app.listen(process.env.SERVER_PORT);
  console.log(`App start on ${process.env.SERVER_PORT} port`);
}
bootstrap();
