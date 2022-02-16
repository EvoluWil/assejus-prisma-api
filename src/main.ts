import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);

  app.enableCors({
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'X-Authorization',
      'X-Token-Auth',
      'Authorization',
    ],
    methods: 'GET, POST, PUT, DELETE, UPDATE, OPTIONS',
  });
}
bootstrap();
