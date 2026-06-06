import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { NotesService } from './notes.service';
import { CreateNoteDto, FilterNotesDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('upload')
  @Roles(UserRole.STUDENT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || '/tmp/uploads/notes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          ![
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.mimetype)
        ) {
          return cb(new Error('Only PDF and DOCX files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadNote(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNoteDto,
    @CurrentUser() user: any,
  ) {
    const note = await this.notesService.uploadNote(body, file.path, user);
    return { message: 'Note uploaded successfully', data: note };
  }

  @Get()
  async getNotes(@Query() query: FilterNotesDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const { data, count } = await this.notesService.getNotes(query, page, limit);
    return { message: 'Notes retrieved successfully', count, data };
  }

  @Get('download/:noteId')
  async downloadNote(@Param('noteId', ParseIntPipe) noteId: number, @Res() res: Response) {
    const note = await this.notesService.getNoteFile(noteId);
    return res.download(join(process.cwd(), note.file_path));
  }
}
