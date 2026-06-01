import { Controller, Get, Patch, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentProfileDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Students Controller
 * Handles student profile management endpoints
 */
@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Update student profile
   * PATCH /api/v1/students/profile
   * Only accessible by students
   */
  @Patch('profile')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student profile' })
  @ApiResponse({ status: 200, description: 'Student profile updated.' })
  async updateProfile(
    @Body() updateStudentProfileDto: UpdateStudentProfileDto,
    @CurrentUser('userId') userId: number,
  ) {
    return await this.studentsService.updateProfile(userId, updateStudentProfileDto);
  }

  /**
   * Get student profile
   * GET /api/v1/students/profile
   * Only accessible by students
   */
  @Get('profile')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get student profile' })
  @ApiResponse({ status: 200, description: 'Student profile returned.' })
  async getProfile(@CurrentUser('userId') userId: number) {
    return await this.studentsService.getProfile(userId);
  }
}
