import { User } from '@modules/users/entities';
export declare class ChatMessage {
    id: string;
    senderId: number;
    receiverId: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
    sender: User;
    receiver: User;
}
