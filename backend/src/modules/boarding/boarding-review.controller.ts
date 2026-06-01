import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardingReviewService } from './boarding-review.service';
import { CreateBoardingReviewDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Boarding Reviews')
@Controller('boarding/:id/reviews')
export class BoardingReviewController {
  constructor(private readonly reviewService: BoardingReviewService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit a review for a boarding post' })
  @ApiResponse({ status: 201, description: 'Review successfully created.' })
  @ApiResponse({ status: 409, description: 'User already reviewed this post.' })
  async createReview(
    @Param('id', ParseIntPipe) postId: number,
    @Body() createReviewDto: CreateBoardingReviewDto,
    @CurrentUser('userId') userId: number,
  ) {
    return await this.reviewService.createReview(postId, userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a boarding post' })
  @ApiResponse({ status: 200, description: 'List of reviews returned.' })
  async getReviews(@Param('id', ParseIntPipe) postId: number) {
    return await this.reviewService.getReviews(postId);
  }
}
