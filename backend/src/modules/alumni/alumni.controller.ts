import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { JwtAuthGuard } from '@modules/auth/guards';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Alumni Insights')
@Controller('alumni')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get the alumni insights and tips feed' })
  async getFeed() {
    return await this.alumniService.getFeed();
  }
}
