import { Repository } from 'typeorm';
import { ChatMessage } from './entities';
import { User } from '@modules/users/entities';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
export declare class ChatService {
    private readonly chatMessageRepository;
    private readonly userRepository;
    private readonly notificationsGateway;
    constructor(chatMessageRepository: Repository<ChatMessage>, userRepository: Repository<User>, notificationsGateway: NotificationsGateway);
    saveMessage(senderId: number, receiverId: number, message: string): Promise<ChatMessage>;
    getHistory(user1Id: number, user2Id: number): Promise<ChatMessage[]>;
    getConversations(userId: number): Promise<any[]>;
}
