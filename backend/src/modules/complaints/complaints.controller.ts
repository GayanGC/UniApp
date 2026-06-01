import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto';
import { JwtAuthGuard } from '@modules/auth/guards';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators';
import { UserRole } from '@common/enums';
import { CurrentUser } from '@common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Complaints')
@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Lodge a new complaint (Student only)' })
  @ApiResponse({ status: 201, description: 'Complaint created successfully.' })
  async createComplaint(
    @CurrentUser('userId') userId: number,
    @Body() dto: CreateComplaintDto,
  ) {
    return await this.complaintsService.createComplaint(userId, dto);
  }

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all complaints lodged by the current student' })
  @ApiResponse({ status: 200, description: 'List of personal complaints.' })
  async getMyComplaints(@CurrentUser('userId') userId: number) {
    return await this.complaintsService.getStudentComplaints(userId);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all system complaints (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all complaints.' })
  async getAllComplaints() {
    return await this.complaintsService.getAllComplaints();
  }

  @Patch('admin/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a complaint status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Complaint status updated.' })
  async updateComplaintStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return await this.complaintsService.updateComplaintStatus(id, dto);
  }
}