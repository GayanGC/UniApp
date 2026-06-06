import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ResourcesService } from './resources.service';
import { UploadResourceDto, GetResourcesFilterDto } from './dto';
import { JwtAuthGuard } from '@modules/auth/guards';
import { CurrentUser } from '@common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

const resourceStorage = diskStorage({
  destination: process.env.UPLOAD_DIR || '/tmp/uploads/resources',
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const resourceFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = /\.(pdf|doc|docx)$/i;
  if (allowed.test(extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only PDF and DOCX files are allowed'), false);
  }
};

@ApiTags('Academic Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a past paper or lecture note' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Resource uploaded successfully.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: resourceStorage,
      fileFilter: resourceFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    }),
  )
  async uploadResource(
    @Body() uploadResourceDto: UploadResourceDto,
    @CurrentUser('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filePath = `/uploads/resources/${file.filename}`;
    return await this.resourcesService.uploadResource(userId, uploadResourceDto, filePath);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources with optional filters' })
  @ApiResponse({ status: 200, description: 'List of resources.' })
  async getResources(@Query() filters: GetResourcesFilterDto) {
    return await this.resourcesService.findAllWithFilters(filters);
  }
}
