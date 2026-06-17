import { User } from '@modules/users/entities';
import { BoardingReview } from './boarding-review.entity';
export declare class BoardingPost {
    postId: number;
    providerUserId: number;
    title: string;
    description: string;
    monthlyRent: number;
    isAvailable: boolean;
    locationDetails: string;
    latitude: number;
    longitude: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    provider: User;
    reviews: BoardingReview[];
}
