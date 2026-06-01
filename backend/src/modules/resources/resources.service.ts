import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { ResourceItem } from './entities';
import { UploadResourceDto, GetResourcesFilterDto } from './dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceItem)
    private readonly resourceRepository: Repository<ResourceItem>,
  ) {}

  async uploadResource(
    uploaderId: number,
    dto: UploadResourceDto,
    filePath: string,
  ): Promise<ResourceItem> {
    try {
      const resource = this.resourceRepository.create({
        title: dto.title,
        subjectCode: dto.subjectCode.toUpperCase(),
        year: dto.year,
        semester: parseInt(dto.semester, 10),
        type: dto.type,
        filePath,
        uploaderId,
      });

      return await this.resourceRepository.save(resource);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save resource to database');
    }
  }

  async findAllWithFilters(filters: GetResourcesFilterDto): Promise<ResourceItem[]> {
    const where: FindOptionsWhere<ResourceItem> = {};

    if (filters.subjectCode) {
      where.subjectCode = ILike(`%${filters.subjectCode.trim()}%`);
    }
    if (filters.year) {
      where.year = filters.year;
    }
    if (filters.semester) {
      where.semester = parseInt(filters.semester, 10);
    }
    if (filters.type) {
      where.type = filters.type;
    }

    return await this.resourceRepository.find({
      where,
      relations: ['uploader'],
      select: {
        uploader: {
          userId: true,
          fullName: true,
        },
      },
      order: { uploadedAt: 'DESC' },
    });
  }
}
