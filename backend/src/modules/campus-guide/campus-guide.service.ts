import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus, CampusPOI } from './entities';
import { CreateCampusDto, CreatePOIDto } from './dto';

/**
 * Campus Guide Service
 * Handles all campus and POI-related business logic
 */
@Injectable()
export class CampusGuideService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
    @InjectRepository(CampusPOI)
    private readonly poiRepository: Repository<CampusPOI>,
  ) {}

  /**
   * Create a new campus (Admin only)
   * @param createCampusDto - Campus creation data
   * @returns Created campus
   */
  async createCampus(createCampusDto: CreateCampusDto): Promise<Campus> {
    try {
      // Check if campus with same name already exists
      const existing = await this.campusRepository.findOne({
        where: { name: createCampusDto.name },
      });

      if (existing) {
        throw new ConflictException('Campus with this name already exists');
      }

      const campus = this.campusRepository.create(createCampusDto);
      return await this.campusRepository.save(campus);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create campus');
    }
  }

  /**
   * Create a new POI (Admin only)
   * @param createPOIDto - POI creation data
   * @returns Created POI
   */
  async createPOI(createPOIDto: CreatePOIDto): Promise<CampusPOI> {
    try {
      // Verify campus exists
      const campus = await this.campusRepository.findOne({
        where: { campusId: createPOIDto.campusId },
      });

      if (!campus) {
        throw new NotFoundException('Campus not found');
      }

      const poi = this.poiRepository.create(createPOIDto);
      return await this.poiRepository.save(poi);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create POI');
    }
  }

  /**
   * Get all campuses (Public)
   * @returns Array of all campuses
   */
  async getAllCampuses(): Promise<Campus[]> {
    return await this.campusRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Get a single campus by ID
   * @param campusId - Campus ID
   * @returns Campus if found
   */
  async getCampusById(campusId: number): Promise<Campus> {
    const campus = await this.campusRepository.findOne({
      where: { campusId },
    });

    if (!campus) {
      throw new NotFoundException('Campus not found');
    }

    return campus;
  }

  /**
   * Get all POIs for a specific campus (Public)
   * @param campusId - Campus ID
   * @returns Array of POIs for the campus
   */
  async getPOIsByCampus(campusId: number): Promise<CampusPOI[]> {
    // Verify campus exists
    await this.getCampusById(campusId);

    return await this.poiRepository.find({
      where: { campusId },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get all campuses with their POIs (Public)
   * @returns Array of campuses with POIs
   */
  async getAllCampusesWithPOIs(): Promise<Campus[]> {
    return await this.campusRepository.find({
      relations: ['pois'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Update a campus (Admin only)
   * @param campusId - Campus ID
   * @param updateData - Update data
   * @returns Updated campus
   */
  async updateCampus(campusId: number, updateData: Partial<CreateCampusDto>): Promise<Campus> {
    const campus = await this.getCampusById(campusId);

    Object.assign(campus, updateData);
    return await this.campusRepository.save(campus);
  }

  /**
   * Delete a campus (Admin only)
   * @param campusId - Campus ID
   */
  async deleteCampus(campusId: number): Promise<void> {
    const campus = await this.getCampusById(campusId);
    await this.campusRepository.remove(campus);
  }

  /**
   * Delete a POI (Admin only)
   * @param poiId - POI ID
   */
  async deletePOI(poiId: number): Promise<void> {
    const poi = await this.poiRepository.findOne({
      where: { poiId },
    });

    if (!poi) {
      throw new NotFoundException('POI not found');
    }

    await this.poiRepository.remove(poi);
  }

  /**
   * Get POIs by category
   * @param category - POI category
   * @returns Array of POIs in the category
   */
  async getPOIsByCategory(category: string): Promise<CampusPOI[]> {
    return await this.poiRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }
}
