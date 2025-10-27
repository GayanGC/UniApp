import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PastPapersService } from './past-papers.service';
import { UploadPastPaperDto, FilterPastPapersDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';
import { multerConfig } from '@config/multer.config';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

/**
 * Past Papers Controller
 * Handles past paper upload, retrieval, and download endpoints
 */
@Controller('past-papers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PastPapersController {
  constructor(private readonly pastPapersService: PastPapersService) {}

  /**
   * Upload a new past paper (Admin only)
   * POST /api/v1/past-papers/upload
   */
  @Post('upload')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadPastPaperDto,
    @CurrentUser('userId') userId: number,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    // Convert string numbers to integers
    const dto = {
      ...uploadDto,
      academicYear: parseInt(uploadDto.academicYear as any, 10),
      examYear: parseInt(uploadDto.examYear as any, 10),
    };

    const pastPaper = await this.pastPapersService.upload(
      dto,
      file.path,
      userId,
    );

    return {
      message: 'Past paper uploaded successfully',
      data: pastPaper,
    };
  }

  /**
   * Get all approved past papers with optional filtering
   * GET /api/v1/past-papers
   */
  @Get()
  async findAll(@Query() filterDto: FilterPastPapersDto) {
    const papers = await this.pastPapersService.findAll(filterDto);
    return {
      message: 'Past papers retrieved successfully',
      count: papers.length,
      data: papers,
    };
  }

  /**
   * Get a single past paper by ID
   * GET /api/v1/past-papers/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const paper = await this.pastPapersService.findOne(id);
    return {
      message: 'Past paper retrieved successfully',
      data: paper,
    };
  }

  /**
   * Download a past paper file
   * GET /api/v1/past-papers/download/:paperId
   */
  @Get('download/:paperId')
  async download(
    @Param('paperId', ParseIntPipe) paperId: number,
    @Res() res: Response,
  ) {
    const paper = await this.pastPapersService.findOne(paperId);

    // Check if file exists
    if (!existsSync(paper.filePath)) {
      throw new BadRequestException('File not found on server');
    }

    // Generate filename for download
    const filename = `${paper.university}_${paper.faculty}_${paper.subjectName}_${paper.examYear}.pdf`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = createReadStream(paper.filePath);
    fileStream.pipe(res);
  }

  /**
   * Approve a past paper (Admin only)
   * POST /api/v1/past-papers/:id/approve
   */
  @Post(':id/approve')
  @Roles(UserRole.ADMIN)
  async approve(@Param('id', ParseIntPipe) id: number) {
    const paper = await this.pastPapersService.approve(id);
    return {
      message: 'Past paper approved successfully',
      data: paper,
    };
  }

  /**
   * Delete a past paper (Admin only)
   * DELETE /api/v1/past-papers/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.pastPapersService.remove(id);
  }

  /**
   * Get past papers uploaded by current user (Admin only)
   * GET /api/v1/past-papers/my-uploads
   */
  @Get('my/uploads')
  @Roles(UserRole.ADMIN)
  async getMyUploads(@CurrentUser('userId') userId: number) {
    const papers = await this.pastPapersService.findByUploader(userId);
    return {
      message: 'Your uploads retrieved successfully',
      count: papers.length,
      data: papers,
    };
  }

  /**
   * Get statistics (Admin only)
   * GET /api/v1/past-papers/stats/summary
   */
  @Get('stats/summary')
  @Roles(UserRole.ADMIN)
  async getStatistics() {
    const stats = await this.pastPapersService.getStatistics();
    return {
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  }
}
