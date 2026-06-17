import { BoardingReviewService } from './boarding-review.service';
import { CreateBoardingReviewDto } from './dto';
export declare class BoardingReviewController {
    private readonly reviewService;
    constructor(reviewService: BoardingReviewService);
    createReview(postId: number, createReviewDto: CreateBoardingReviewDto, userId: number): Promise<import("./entities").BoardingReview>;
    getReviews(postId: number): Promise<import("./entities").BoardingReview[]>;
}
