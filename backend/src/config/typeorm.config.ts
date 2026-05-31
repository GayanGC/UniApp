import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User, Student } from '@modules/users/entities';
import { BoardingPost } from '@modules/boarding/entities';
import { PastPaper } from '@modules/past-papers/entities';
import { Campus, CampusPOI } from '@modules/campus-guide/entities';

// Load environment variables
config();

const configService = new ConfigService();

/**
 * TypeORM Configuration
 * Used for database connection and migrations
 */
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'uni_app_db'),
  entities: [User, Student, BoardingPost, PastPaper, Campus, CampusPOI],
  migrations: ['dist/migrations/*.js'],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DB_LOGGING', true),
  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
};

// DataSource for migrations
const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
