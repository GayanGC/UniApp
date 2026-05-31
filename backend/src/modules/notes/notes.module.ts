import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { StudyNote } from './study-note.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudyNote]), UsersModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
