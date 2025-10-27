import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusGuideService } from './campus-guide.service';
import { CampusGuideController } from './campus-guide.controller';
import { Campus, CampusPOI } from './entities';

/**
 * Campus Guide Module
 * Handles campus locations and Points of Interest
 */
@Module({
  imports: [TypeOrmModule.forFeature([Campus, CampusPOI])],
  controllers: [CampusGuideController],
  providers: [CampusGuideService],
  exports: [CampusGuideService],
})
export class CampusGuideModule {}
