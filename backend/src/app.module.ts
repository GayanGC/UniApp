import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { databaseConfig, jwtConfig, typeOrmConfig } from './config';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { StudentsModule } from '@modules/students/students.module';
import { BoardingModule } from '@modules/boarding/boarding.module';
import { PastPapersModule } from '@modules/past-papers/past-papers.module';
import { CampusGuideModule } from '@modules/campus-guide/campus-guide.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { JwtAuthGuard } from '@modules/auth/guards';

/**
 * App Module
 * Root module of the application
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: typeOrmConfig.entities,
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      }),
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    StudentsModule,
    BoardingModule,
    PastPapersModule,
    CampusGuideModule,
    NotificationsModule,
  ],
  providers: [
    // Apply JWT guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
