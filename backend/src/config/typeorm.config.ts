import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User, Student } from '@modules/users/entities';
import { BoardingPost, BoardingReview } from '@modules/boarding/entities';
import { PastPaper } from '@modules/past-papers/entities';
import { Campus, CampusPOI } from '@modules/campus-guide/entities';
import { ChatMessage } from '@modules/chat/entities';
import { ResourceItem } from '@modules/resources/entities';
import { Complaint } from '@modules/complaints/complaint.entity';
import { PaymentInvoice } from '@modules/finance/payment-invoice.entity';
import { LocalMerchant } from '@modules/lifestyle/entities/local-merchant.entity';
import { CampusEvent } from '@modules/lifestyle/entities/campus-event.entity';
import { AlumniFeed } from '@modules/alumni/entities/alumni-feed.entity';
import { AnonymousComplaint } from '@modules/safety/entities/anonymous-complaint.entity';

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
  entities: [User, Student, BoardingPost, BoardingReview, PastPaper, Campus, CampusPOI, ChatMessage, ResourceItem, Complaint, PaymentInvoice, LocalMerchant, CampusEvent, AlumniFeed, AnonymousComplaint],
  migrations: ['dist/migrations/*.js'],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DB_LOGGING', true),
  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  retryAttempts: 1,
  retryDelay: 3000,
  extra: {
    max: 10,
    connectionTimeoutMillis: 5000,
  },
};

// DataSource for migrations
const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
