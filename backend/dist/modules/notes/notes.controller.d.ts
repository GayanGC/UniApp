import { Response } from 'express';
import { NotesService } from './notes.service';
import { CreateNoteDto, FilterNotesDto } from './dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    uploadNote(file: Express.Multer.File, body: CreateNoteDto, user: any): Promise<{
        message: string;
        data: import("./study-note.entity").StudyNote;
    }>;
    getNotes(query: FilterNotesDto): Promise<{
        message: string;
        count: number;
        data: import("./study-note.entity").StudyNote[];
    }>;
    downloadNote(noteId: number, res: Response): Promise<void>;
}
