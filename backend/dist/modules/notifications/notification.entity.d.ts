import { User } from '@modules/users/entities';
export declare class Notification {
    notificationId: number;
    userId: number;
    title: string;
    content: string;
    isRead: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
