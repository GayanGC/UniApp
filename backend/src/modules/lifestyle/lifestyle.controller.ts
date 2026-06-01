import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LifestyleService } from './lifestyle.service';
import { JwtAuthGuard } from '@modules/auth/guards';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Campus Lifestyle')
@Controller('lifestyle')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LifestyleController {
  constructor(private readonly lifestyleService: LifestyleService) {}

  @Get('campus/:campusId/merchants')
  @ApiOperation({ summary: 'Get local merchants and offers for a specific campus' })
  async getMerchants(@Param('campusId', ParseIntPipe) campusId: number) {
    return await this.lifestyleService.getMerchantsByCampus(campusId);
  }

  @Get('campus/:campusId/events')
  @ApiOperation({ summary: 'Get active events for a specific campus' })
  async getEvents(@Param('campusId', ParseIntPipe) campusId: number) {
    return await this.lifestyleService.getEventsByCampus(campusId);
  }
}
