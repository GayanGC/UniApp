import { Repository } from 'typeorm';
import { BoardingReview, BoardingPost } from './entities';
import { CreateBoardingReviewDto } from './dto';
export declare class BoardingReviewService {
    private readonly reviewRepository;
    private readonly boardingRepository;
    constructor(reviewRepository: Repository<BoardingReview>, boardingRepository: Repository<BoardingPost>);
    createReview(postId: number, studentUserId: number, createReviewDto: CreateBoardingReviewDto): Promise<BoardingReview>;
    getReviews(postId: number): Promise<BoardingReview[]>;
}
