import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniFeed } from './entities/alumni-feed.entity';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlumniFeed])],
  controllers: [AlumniController],
  providers: [AlumniService],
  exports: [AlumniService],
})
export class AlumniModule {}
