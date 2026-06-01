import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded files at /uploads/*  (e.g. /uploads/boarding/abc.jpg)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

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

  // Swagger OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Uni App API')
    .setDescription('The backend API documentation for Uni App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = configService.get<number>('PORT', 3000);

  if (!process.env.VERCEL) {
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

  await app.init();
  return app.getHttpAdapter().getInstance();
}

let cachedServer: any;

if (process.env.VERCEL) {
  module.exports = async (req: any, res: any) => {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
  };
} else {
  bootstrap();
}
