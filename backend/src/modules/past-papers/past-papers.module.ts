import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PastPapersService } from './past-papers.service';
import { PastPapersController } from './past-papers.controller';
import { PastPaper } from './entities';
import { multerConfig } from '@config/multer.config';

/**
 * Past Papers Module
 * Handles past examination papers upload and retrieval
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([PastPaper]),
    MulterModule.register(multerConfig),
  ],
  controllers: [PastPapersController],
  providers: [PastPapersService],
  exports: [PastPapersService],
})
export class PastPapersModule {}
