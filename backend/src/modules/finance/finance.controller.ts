import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '@modules/auth/guards';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators';
import { UserRole } from '@common/enums';
import { CurrentUser } from '@common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Finance & Scholarships')
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dynamic financial aggregates for the student' })
  @ApiResponse({ status: 200, description: 'Financial summary returned successfully.' })
  async getSummary(@CurrentUser('userId') userId: number) {
    return await this.financeService.getSummary(userId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get detailed list of all payment invoices' })
  @ApiResponse({ status: 200, description: 'List of invoices returned.' })
  async getInvoices(@CurrentUser('userId') userId: number) {
    return await this.financeService.getInvoices(userId);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Get monthly financial trends for charting' })
  @ApiResponse({ status: 200, description: 'Chart data returned.' })
  async getChartData(@CurrentUser('userId') userId: number) {
    return await this.financeService.getChartData(userId);
  }
}
