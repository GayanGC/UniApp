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

  // Global Express error logging middleware — surfaces crash traces in Vercel logs
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('[CRITICAL RUNTIME ERROR]', {
      method: req.method,
      url: req.url,
      message: err.message,
      stack: err.stack,
    });
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
      statusCode: err.status || 500,
      message: err.message || 'Internal server error',
    });
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
