import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PastPaper } from './entities';
import { UploadPastPaperDto, FilterPastPapersDto } from './dto';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Past Papers Service
 * Handles all past paper-related business logic
 */
@Injectable()
export class PastPapersService {
  constructor(
    @InjectRepository(PastPaper)
    private readonly pastPaperRepository: Repository<PastPaper>,
  ) {}

  /**
   * Upload a new past paper
   * @param uploadDto - Past paper metadata
   * @param filePath - Path where the file is stored
   * @param userId - ID of the user uploading the paper
   * @returns Created past paper
   */
  async upload(
    uploadDto: UploadPastPaperDto,
    filePath: string,
    userId: number,
  ): Promise<PastPaper> {
    try {
      const pastPaper = this.pastPaperRepository.create({
        university: uploadDto.university,
        faculty: uploadDto.faculty,
        subjectName: uploadDto.subjectName,
        academicYear: uploadDto.academicYear,
        examYear: uploadDto.examYear,
        filePath,
        uploadedByUserId: userId,
        isApproved: false, // Requires approval by default
      });

      return await this.pastPaperRepository.save(pastPaper);
    } catch (error) {
      // If database save fails, delete the uploaded file
      if (existsSync(filePath)) {
        await unlink(filePath).catch(() => {});
      }
      throw new InternalServerErrorException('Failed to upload past paper');
    }
  }

  /**
   * Find all approved past papers with optional filtering
   * @param filterDto - Filter criteria
   * @returns Array of approved past papers
   */
  async findAll(filterDto: FilterPastPapersDto): Promise<PastPaper[]> {
    const query = this.pastPaperRepository
      .createQueryBuilder('paper')
      .where('paper.isApproved = :isApproved', { isApproved: true });

    // Apply filters
    if (filterDto.university) {
      query.andWhere('LOWER(paper.university) = LOWER(:university)', {
        university: filterDto.university,
      });
    }

    if (filterDto.faculty) {
      query.andWhere('LOWER(paper.faculty) = LOWER(:faculty)', {
        faculty: filterDto.faculty,
      });
    }

    if (filterDto.subjectName) {
      query.andWhere('LOWER(paper.subjectName) LIKE LOWER(:subjectName)', {
        subjectName: `%${filterDto.subjectName}%`,
      });
    }

    if (filterDto.academicYear) {
      query.andWhere('paper.academicYear = :academicYear', {
        academicYear: filterDto.academicYear,
      });
    }

    if (filterDto.examYear) {
      query.andWhere('paper.examYear = :examYear', {
        examYear: filterDto.examYear,
      });
    }

    // Order by most recent first
    query.orderBy('paper.examYear', 'DESC')
      .addOrderBy('paper.createdAt', 'DESC');

    return await query.getMany();
  }

  /**
   * Find a single past paper by ID
   * @param paperId - Past paper ID
   * @returns Past paper if found
   */
  async findOne(paperId: number): Promise<PastPaper> {
    const paper = await this.pastPaperRepository.findOne({
      where: { paperId },
      relations: ['uploadedBy'],
      select: {
        uploadedBy: {
          userId: true,
          fullName: true,
          email: true,
        },
      },
    });

    if (!paper) {
      throw new NotFoundException('Past paper not found');
    }

    return paper;
  }

  /**
   * Approve a past paper (Admin only)
   * @param paperId - Past paper ID
   * @returns Updated past paper
   */
  async approve(paperId: number): Promise<PastPaper> {
    const paper = await this.findOne(paperId);

    paper.isApproved = true;
    return await this.pastPaperRepository.save(paper);
  }

  /**
   * Delete a past paper
   * @param paperId - Past paper ID
   */
  async remove(paperId: number): Promise<void> {
    const paper = await this.findOne(paperId);

    try {
      // Delete the file from filesystem
      if (existsSync(paper.filePath)) {
        await unlink(paper.filePath);
      }

      // Delete from database
      await this.pastPaperRepository.remove(paper);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete past paper');
    }
  }

  /**
   * Get all past papers uploaded by a specific user
   * @param userId - User ID
   * @returns Array of past papers
   */
  async findByUploader(userId: number): Promise<PastPaper[]> {
    return await this.pastPaperRepository.find({
      where: { uploadedByUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get statistics about past papers
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    total: number;
    approved: number;
    pending: number;
  }> {
    const total = await this.pastPaperRepository.count();
    const approved = await this.pastPaperRepository.count({
      where: { isApproved: true },
    });
    const pending = total - approved;

    return { total, approved, pending };
  }
}
