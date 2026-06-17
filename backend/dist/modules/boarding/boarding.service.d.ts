import { Repository } from 'typeorm';
import { BoardingPost } from './entities';
import { CreateBoardingPostDto, UpdateBoardingPostDto, GetBoardingFilterDto } from './dto';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
export declare class BoardingService {
    private readonly boardingPostRepository;
    private readonly notificationsGateway;
    constructor(boardingPostRepository: Repository<BoardingPost>, notificationsGateway: NotificationsGateway);
    create(providerUserId: number, createBoardingPostDto: CreateBoardingPostDto): Promise<BoardingPost>;
    findMyPosts(providerUserId: number): Promise<BoardingPost[]>;
    findAllWithFilters(filterDto: GetBoardingFilterDto): Promise<{
        data: BoardingPost[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(postId: number): Promise<BoardingPost>;
    update(postId: number, providerUserId: number, updateBoardingPostDto: UpdateBoardingPostDto): Promise<BoardingPost>;
    remove(postId: number, providerUserId: number): Promise<void>;
    getProviderAnalytics(providerUserId: number): Promise<{
        totalPosts: number;
        totalReviewsCount: number;
        averageRating: number;
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
    }>;
}
