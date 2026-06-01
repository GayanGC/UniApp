import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities';
import { User } from '@modules/users/entities';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Save a chat message to DB and emit real-time event
   */
  async saveMessage(senderId: number, receiverId: number, message: string): Promise<ChatMessage> {
    const chatMsg = this.chatMessageRepository.create({
      senderId,
      receiverId,
      message,
    });
    
    const saved = await this.chatMessageRepository.save(chatMsg);
    
    // Fetch sender info to populate the event payload
    const sender = await this.userRepository.findOne({ where: { userId: senderId } });
    if (sender) {
      saved.sender = sender;
    }

    // Emit to receiver using shared notifications gateway infrastructure
    this.notificationsGateway.emitToUser(receiverId, 'receive_message', saved);
    
    // Optionally emit back to sender so other tabs update
    this.notificationsGateway.emitToUser(senderId, 'receive_message', saved);

    return saved;
  }

  /**
   * Get historical messages between two users
   */
  async getHistory(user1Id: number, user2Id: number): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.find({
      where: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get conversation inbox for a user.
   * Returns a list of distinct users this user has chatted with,
   * along with the latest message and unread count.
   */
  async getConversations(userId: number): Promise<any[]> {
    // This is a complex query to get unique conversations. 
    // We'll use the query builder to get distinct counterpart IDs and the latest message.
    
    const messages = await this.chatMessageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });

    // Map counterpart -> latest message
    const conversationMap = new Map<number, any>();
    
    for (const msg of messages) {
      const counterpartId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const counterpart = msg.senderId === userId ? msg.receiver : msg.sender;
      
      if (!conversationMap.has(counterpartId)) {
        conversationMap.set(counterpartId, {
          user: {
            userId: counterpart.userId,
            fullName: counterpart.fullName,
            email: counterpart.email,
            role: counterpart.role,
          },
          latestMessage: msg,
          unreadCount: 0,
        });
      }
      
      // Calculate unread count (if the user is the receiver and it's not read)
      if (msg.receiverId === userId && !msg.isRead) {
        conversationMap.get(counterpartId)!.unreadCount++;
      }
    }

    return Array.from(conversationMap.values());
  }
}
