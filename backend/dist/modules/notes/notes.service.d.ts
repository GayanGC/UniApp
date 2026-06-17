import { Repository } from 'typeorm';
import { StudyNote } from './study-note.entity';
import { CreateNoteDto, FilterNotesDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class NotesService {
    private readonly notesRepository;
    constructor(notesRepository: Repository<StudyNote>);
    uploadNote(createNoteDto: CreateNoteDto, filePath: string, user: User): Promise<StudyNote>;
    getNotes(filter: FilterNotesDto, page?: number, limit?: number): Promise<{
        data: StudyNote[];
        count: number;
    }>;
    getNoteFile(noteId: number): Promise<StudyNote>;
}
