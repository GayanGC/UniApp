import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BoardingService } from './boarding.service';
import { CreateBoardingPostDto, UpdateBoardingPostDto, GetBoardingFilterDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

/**
 * Multer disk-storage config shared by both Create and Update endpoints.
 *
 * Files are stored at:  <project-root>/uploads/boarding/<uuid><ext>
 * The path returned to the client/stored in the DB is the server-relative
 * URL: /uploads/boarding/<uuid><ext>
 */
const boardingImageStorage = diskStorage({
  destination: './uploads/boarding',
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

/**
 * Only allow common image MIME types.
 * Rejects anything else with a clear error message.
 */
const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
  if (allowed.test(extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed'), false);
  }
};

/**
 * Boarding Controller
 * Handles boarding post management endpoints
 */
@ApiTags('Boarding')
@ApiBearerAuth()
@Controller('boarding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoardingController {
  constructor(private readonly boardingService: BoardingService) {}

  /**
   * Create a new boarding post (with optional image uploads).
   * POST /api/v1/boarding
   *
   * Request: multipart/form-data
   *   Fields: title, description, monthlyRent, isAvailable, locationDetails
   *   Files:  images[] (up to 6 images, optional)
   *
   * Only accessible by boarding providers.
   */
  @Post()
  @Roles(UserRole.BOARDING_PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new boarding post (with optional image uploads)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Boarding post created.' })
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: boardingImageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
    }),
  )
  async create(
    @Body() createBoardingPostDto: CreateBoardingPostDto,
    @CurrentUser('userId') userId: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Map uploaded files → server-relative paths stored in the DB
    if (files && files.length > 0) {
      createBoardingPostDto.images = files.map(
        (f) => `/uploads/boarding/${f.filename}`,
      );
    }
    return await this.boardingService.create(userId, createBoardingPostDto);
  }

  /**
   * Get all posts created by the authenticated provider.
   * GET /api/v1/boarding/my-posts
   * Only accessible by boarding providers.
   */
  @Get('my-posts')
  @Roles(UserRole.BOARDING_PROVIDER)
  @ApiOperation({ summary: 'Get all posts created by the authenticated provider' })
  @ApiResponse({ status: 200, description: 'List of posts.' })
  async getMyPosts(@CurrentUser('userId') userId: number) {
    return await this.boardingService.findMyPosts(userId);
  }

  /**
   * Get analytics for the authenticated provider.
   * GET /api/v1/boarding/provider/analytics
   * Only accessible by boarding providers.
   */
  @Get('provider/analytics')
  @Roles(UserRole.BOARDING_PROVIDER)
  @ApiOperation({ summary: 'Get analytics dashboard metrics for the provider' })
  @ApiResponse({ status: 200, description: 'Analytics data returned.' })
  async getProviderAnalytics(@CurrentUser('userId') userId: number) {
    return await this.boardingService.getProviderAnalytics(userId);
  }

  /**
   * Get all boarding posts with optional search & filtering.
   * GET /api/v1/boarding
   * GET /api/v1/boarding?location=colombo&minPrice=100&maxPrice=500&available=true
   *
   * All query parameters are optional. When none are provided the endpoint
   * behaves exactly as before — returning all currently available posts.
   * Accessible by all authenticated users.
   */
  @Get()
  @ApiOperation({ summary: 'Get all boarding posts with optional search & filtering' })
  @ApiResponse({ status: 200, description: 'Paginated list of boarding posts.' })
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    filterDto: GetBoardingFilterDto,
  ) {
    return await this.boardingService.findAllWithFilters(filterDto);
  }

  /**
   * Get a single boarding post by ID (includes provider relation).
   * GET /api/v1/boarding/:id
   * Accessible by all authenticated users.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single boarding post by ID' })
  @ApiResponse({ status: 200, description: 'The boarding post.' })
  @ApiResponse({ status: 404, description: 'Boarding post not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.boardingService.findOne(id);
  }

  /**
   * Update a boarding post (with optional image uploads).
   * PATCH /api/v1/boarding/:id
   *
   * Request: multipart/form-data
   *   Fields: title?, description?, monthlyRent?, isAvailable?, locationDetails?
   *   Files:  images[] (up to 6 images, optional — replaces existing images)
   *
   * Only accessible by boarding providers (owner of the post).
   */
  @Patch(':id')
  @Roles(UserRole.BOARDING_PROVIDER)
  @ApiOperation({ summary: 'Update a boarding post (with optional image uploads)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Boarding post updated.' })
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: boardingImageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoardingPostDto: UpdateBoardingPostDto,
    @CurrentUser('userId') userId: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      updateBoardingPostDto.images = files.map(
        (f) => `/uploads/boarding/${f.filename}`,
      );
    }
    return await this.boardingService.update(id, userId, updateBoardingPostDto);
  }

  /**
   * Delete a boarding post.
   * DELETE /api/v1/boarding/:id
   * Only accessible by boarding providers (owner of the post).
   */
  @Delete(':id')
  @Roles(UserRole.BOARDING_PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a boarding post' })
  @ApiResponse({ status: 204, description: 'Boarding post deleted.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    await this.boardingService.remove(id, userId);
  }
}
