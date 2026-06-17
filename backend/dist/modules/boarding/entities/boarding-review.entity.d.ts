import { BoardingPost } from './boarding-post.entity';
import { User } from '@modules/users/entities';
export declare class BoardingReview {
    id: string;
    postId: number;
    studentUserId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    post: BoardingPost;
    student: User;
}
