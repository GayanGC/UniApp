import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardingService } from './boarding.service';
import { CreateBoardingPostDto, UpdateBoardingPostDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';

/**
 * Boarding Controller
 * Handles boarding post management endpoints
 */
@Controller('boarding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoardingController {
  constructor(private readonly boardingService: BoardingService) {}

  /**
   * Create a new boarding post
   * POST /api/v1/boarding
   * Only accessible by boarding providers
   */
  @Post()
  @Roles(UserRole.BOARDING_PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBoardingPostDto: CreateBoardingPostDto,
    @CurrentUser('userId') userId: number,
  ) {
    return await this.boardingService.create(userId, createBoardingPostDto);
  }

  /**
   * Get all posts created by the authenticated provider
   * GET /api/v1/boarding/my-posts
   * Only accessible by boarding providers
   */
  @Get('my-posts')
  @Roles(UserRole.BOARDING_PROVIDER)
  async getMyPosts(@CurrentUser('userId') userId: number) {
    return await this.boardingService.findMyPosts(userId);
  }

  /**
   * Get all available boarding posts
   * GET /api/v1/boarding
   * Accessible by all authenticated users
   */
  @Get()
  async findAll() {
    return await this.boardingService.findAllAvailable();
  }

  /**
   * Get a single boarding post by ID
   * GET /api/v1/boarding/:id
   * Accessible by all authenticated users
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.boardingService.findOne(id);
  }

  /**
   * Update a boarding post
   * PATCH /api/v1/boarding/:id
   * Only accessible by boarding providers (owner of the post)
   */
  @Patch(':id')
  @Roles(UserRole.BOARDING_PROVIDER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoardingPostDto: UpdateBoardingPostDto,
    @CurrentUser('userId') userId: number,
  ) {
    return await this.boardingService.update(id, userId, updateBoardingPostDto);
  }

  /**
   * Delete a boarding post
   * DELETE /api/v1/boarding/:id
   * Only accessible by boarding providers (owner of the post)
   */
  @Delete(':id')
  @Roles(UserRole.BOARDING_PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    await this.boardingService.remove(id, userId);
  }
}
