import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardingService } from './boarding.service';
import { BoardingController } from './boarding.controller';
import { BoardingPost } from './entities';
import { NotificationsModule } from '@modules/notifications/notifications.module';

/**
 * Boarding Module
 * Handles boarding post management functionality.
 *
 * Imports NotificationsModule so BoardingService can inject
 * NotificationsGateway and push real-time events to providers.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BoardingPost]),
    NotificationsModule,
  ],
  controllers: [BoardingController],
  providers: [BoardingService],
  exports: [BoardingService],
})
export class BoardingModule {}
