import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardingService } from './boarding.service';
import { BoardingReviewService } from './boarding-review.service';
import { BoardingController } from './boarding.controller';
import { BoardingReviewController } from './boarding-review.controller';
import { BoardingPost, BoardingReview } from './entities';
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
    TypeOrmModule.forFeature([BoardingPost, BoardingReview]),
    NotificationsModule,
  ],
  controllers: [BoardingController, BoardingReviewController],
  providers: [BoardingService, BoardingReviewService],
  exports: [BoardingService],
})
export class BoardingModule {}
