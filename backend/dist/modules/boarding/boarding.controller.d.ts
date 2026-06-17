import { BoardingService } from './boarding.service';
import { CreateBoardingPostDto, UpdateBoardingPostDto, GetBoardingFilterDto } from './dto';
export declare class BoardingController {
    private readonly boardingService;
    constructor(boardingService: BoardingService);
    create(createBoardingPostDto: CreateBoardingPostDto, userId: number, files?: Express.Multer.File[]): Promise<import("./entities").BoardingPost>;
    getMyPosts(userId: number): Promise<import("./entities").BoardingPost[]>;
    getProviderAnalytics(userId: number): Promise<{
        totalPosts: number;
        totalReviewsCount: number;
        averageRating: number;
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
    }>;
    findAll(filterDto: GetBoardingFilterDto): Promise<{
        data: import("./entities").BoardingPost[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: number): Promise<import("./entities").BoardingPost>;
    update(id: number, updateBoardingPostDto: UpdateBoardingPostDto, userId: number, files?: Express.Multer.File[]): Promise<import("./entities").BoardingPost>;
    remove(id: number, userId: number): Promise<void>;
}
