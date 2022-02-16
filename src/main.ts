import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: ['https://assejusonline.com.br', 'http://localhost:3000'],
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
  await app.listen(process.env.PORT);
}
bootstrap();
