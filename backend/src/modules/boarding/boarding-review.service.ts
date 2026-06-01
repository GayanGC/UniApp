import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardingReview, BoardingPost } from './entities';
import { CreateBoardingReviewDto } from './dto';

@Injectable()
export class BoardingReviewService {
  constructor(
    @InjectRepository(BoardingReview)
    private readonly reviewRepository: Repository<BoardingReview>,
    @InjectRepository(BoardingPost)
    private readonly boardingRepository: Repository<BoardingPost>,
  ) {}

  async createReview(
    postId: number,
    studentUserId: number,
    createReviewDto: CreateBoardingReviewDto,
  ): Promise<BoardingReview> {
    const post = await this.boardingRepository.findOne({ where: { postId } });
    if (!post) {
      throw new NotFoundException('Boarding post not found');
    }

    // Check if user already reviewed
    const existing = await this.reviewRepository.findOne({
      where: { postId, studentUserId },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this boarding post');
    }

    try {
      const review = this.reviewRepository.create({
        postId,
        studentUserId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      });

      return await this.reviewRepository.save(review);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  async getReviews(postId: number): Promise<BoardingReview[]> {
    return await this.reviewRepository.find({
      where: { postId },
      relations: ['student'],
      select: {
        student: {
          userId: true,
          fullName: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
