import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@common/enums';

@Controller('api/v1/complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async submitComplaint(@Body() dto: CreateComplaintDto, @Req() req: any) {
    const userId = dto.is_anonymous ? null : req.user.user_id;
    return await this.complaintsService.submitComplaint(dto, userId);
  }
}