import { registerAs } from '@nestjs/config';

/**
 * Database Configuration
 * Registers database settings for dependency injection.
 * Supports DATABASE_URL (Neon/Vercel) or individual DB_* env vars (local dev).
 */
export default registerAs('database', () => {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl) {
    // Parse Neon / Postgres connection string directly
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    };
  }

  // Fallback for local development
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'uni_app_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  };
});

