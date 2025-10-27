import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(','),
    credentials: configService.get<boolean>('CORS_CREDENTIALS', true),
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🎓 Uni App Backend API                                  ║
    ║                                                           ║
    ║   🚀 Server running on: http://localhost:${port}            ║
    ║   📚 API Prefix: /${apiPrefix}                             ║
    ║   🌍 Environment: ${configService.get<string>('NODE_ENV', 'development')}                           ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
