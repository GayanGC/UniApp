import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@common/enums';

@Controller('api/v1/admin/complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  async getAllComplaints(@Query('page') page = 1, @Query('limit') limit = 20) {
    return await this.complaintsService.getAllComplaints(Number(page), Number(limit));
  }

  @Patch(':complaintId')
  async updateComplaint(
    @Param('complaintId') complaintId: number,
    @Body() dto: UpdateComplaintDto,
  ) {
    return await this.complaintsService.updateComplaint(complaintId, dto);
  }
}