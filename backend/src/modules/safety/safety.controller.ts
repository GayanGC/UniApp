import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { CreateAnonymousComplaintDto } from './dto/create-anonymous-complaint.dto';
import { Public } from '@common/decorators';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Campus Safety')
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Public()
  @Post('anti-ragging')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a strictly anonymous anti-ragging report' })
  @ApiResponse({ status: 201, description: 'Anonymous report submitted and alerted successfully.' })
  async submitAnonymousComplaint(@Body() dto: CreateAnonymousComplaintDto) {
    return await this.safetyService.submitAnonymousComplaint(dto);
  }
}
