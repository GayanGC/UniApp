import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyNote } from './study-note.entity';
import { CreateNoteDto, FilterNotesDto } from './dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(StudyNote)
    private readonly notesRepository: Repository<StudyNote>,
  ) {}

  async uploadNote(createNoteDto: CreateNoteDto, filePath: string, user: User): Promise<StudyNote> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      file_path: filePath,
      uploaded_by_user_id: user.userId,
      is_approved: false,
    });
    return await this.notesRepository.save(note);
  }

  async getNotes(
    filter: FilterNotesDto,
    page = 1,
    limit = 10,
  ): Promise<{ data: StudyNote[]; count: number }> {
    const query = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.uploader', 'uploader')
      .where('note.is_approved = TRUE');

    if (filter.university) {
      query.andWhere('note.university = :university', { university: filter.university });
    }
    if (filter.faculty) {
      query.andWhere('note.faculty = :faculty', { faculty: filter.faculty });
    }
    if (filter.subject_code) {
      query.andWhere('note.subject_code = :subject_code', { subject_code: filter.subject_code });
    }
    if (filter.academic_year) {
      query.andWhere('note.academic_year = :academic_year', {
        academic_year: filter.academic_year,
      });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('note.upload_date', 'DESC');
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async getNoteFile(noteId: number): Promise<StudyNote> {
    const note = await this.notesRepository.findOne({ where: { note_id: noteId } });
    if (!note) throw new NotFoundException('Note not found');
    if (!note.is_approved) throw new ForbiddenException('Note not approved');
    return note;
  }
}
