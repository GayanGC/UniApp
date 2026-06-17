import { User } from '@modules/users/entities';
export declare class AlumniFeed {
    id: string;
    content: string;
    company: string;
    role: string;
    createdAt: Date;
    authorId: number;
    author: User;
}
