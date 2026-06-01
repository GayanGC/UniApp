import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalMerchant } from './entities/local-merchant.entity';
import { CampusEvent } from './entities/campus-event.entity';
import { LifestyleService } from './lifestyle.service';
import { LifestyleController } from './lifestyle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocalMerchant, CampusEvent])],
  controllers: [LifestyleController],
  providers: [LifestyleService],
  exports: [LifestyleService],
})
export class LifestyleModule {}
