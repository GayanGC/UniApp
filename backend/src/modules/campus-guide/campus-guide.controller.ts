import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampusGuideService } from './campus-guide.service';
import { CreateCampusDto, CreatePOIDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, Public } from '@common/decorators';
import { UserRole } from '@common/enums';

/**
 * Campus Guide Controller
 * Handles campus and POI management endpoints
 */
@Controller('campus-guide')
export class CampusGuideController {
  constructor(private readonly campusGuideService: CampusGuideService) {}

  /**
   * Create a new campus (Admin only)
   * POST /api/v1/campus-guide/campus
   */
  @Post('campus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createCampus(@Body() createCampusDto: CreateCampusDto) {
    const campus = await this.campusGuideService.createCampus(createCampusDto);
    return {
      message: 'Campus created successfully',
      data: campus,
    };
  }

  /**
   * Create a new POI (Admin only)
   * POST /api/v1/campus-guide/poi
   */
  @Post('poi')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPOI(@Body() createPOIDto: CreatePOIDto) {
    const poi = await this.campusGuideService.createPOI(createPOIDto);
    return {
      message: 'POI created successfully',
      data: poi,
    };
  }

  /**
   * Get all campuses (Public)
   * GET /api/v1/campus-guide/all
   */
  @Get('all')
  @Public()
  async getAllCampuses() {
    const campuses = await this.campusGuideService.getAllCampuses();
    return {
      message: 'Campuses retrieved successfully',
      count: campuses.length,
      data: campuses,
    };
  }

  /**
   * Get all campuses with POIs (Public)
   * GET /api/v1/campus-guide/all-with-pois
   */
  @Get('all-with-pois')
  @Public()
  async getAllCampusesWithPOIs() {
    const campuses = await this.campusGuideService.getAllCampusesWithPOIs();
    return {
      message: 'Campuses with POIs retrieved successfully',
      count: campuses.length,
      data: campuses,
    };
  }

  /**
   * Get a single campus by ID (Public)
   * GET /api/v1/campus-guide/campus/:id
   */
  @Get('campus/:id')
  @Public()
  async getCampusById(@Param('id', ParseIntPipe) id: number) {
    const campus = await this.campusGuideService.getCampusById(id);
    return {
      message: 'Campus retrieved successfully',
      data: campus,
    };
  }

  /**
   * Get all POIs for a specific campus (Public)
   * GET /api/v1/campus-guide/pois/:campusId
   */
  @Get('pois/:campusId')
  @Public()
  async getPOIsByCampus(@Param('campusId', ParseIntPipe) campusId: number) {
    const pois = await this.campusGuideService.getPOIsByCampus(campusId);
    return {
      message: 'POIs retrieved successfully',
      count: pois.length,
      data: pois,
    };
  }

  /**
   * Get POIs by category (Public)
   * GET /api/v1/campus-guide/pois/category/:category
   */
  @Get('pois/category/:category')
  @Public()
  async getPOIsByCategory(@Param('category') category: string) {
    const pois = await this.campusGuideService.getPOIsByCategory(category);
    return {
      message: 'POIs retrieved successfully',
      count: pois.length,
      data: pois,
    };
  }

  /**
   * Delete a campus (Admin only)
   * DELETE /api/v1/campus-guide/campus/:id
   */
  @Delete('campus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCampus(@Param('id', ParseIntPipe) id: number) {
    await this.campusGuideService.deleteCampus(id);
  }

  /**
   * Delete a POI (Admin only)
   * DELETE /api/v1/campus-guide/poi/:id
   */
  @Delete('poi/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePOI(@Param('id', ParseIntPipe) id: number) {
    await this.campusGuideService.deletePOI(id);
  }
}
