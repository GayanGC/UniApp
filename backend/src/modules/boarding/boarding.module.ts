import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardingService } from './boarding.service';
import { BoardingController } from './boarding.controller';
import { BoardingPost } from './entities';

/**
 * Boarding Module
 * Handles boarding post management functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([BoardingPost])],
  controllers: [BoardingController],
  providers: [BoardingService],
  exports: [BoardingService],
})
export class BoardingModule {}
