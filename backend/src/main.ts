import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import express from 'express';

// Create the Express instance — exported as the Vercel serverless handler
const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Native cors middleware — runs before any NestJS guard or pipe
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

  // Global error logging middleware — surfaces crash traces in Vercel Function logs
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

  // Use init() instead of listen() — Vercel handles the port binding
  await app.init();
}

bootstrap();

// Export the Express instance as the default handler for Vercel serverless
export default server;
