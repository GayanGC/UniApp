import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inject native cors as top-level middleware before NestJS processes any routes
  // This ensures OPTIONS preflight requests are resolved immediately
  app.use(
    cors({
      origin: ['https://uniapp-prod-frontend.vercel.app', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
      preflightContinue: false,
      optionsSuccessStatus: 200,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
