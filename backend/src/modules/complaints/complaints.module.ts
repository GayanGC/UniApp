import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { AdminComplaintsController } from './admin-complaints.controller';
import { Complaint } from './complaint.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), UsersModule],
  providers: [ComplaintsService],
  controllers: [ComplaintsController, AdminComplaintsController],
})
export class ComplaintsModule {}
