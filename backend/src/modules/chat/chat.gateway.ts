import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto';
import { Logger } from '@nestjs/common';

/**
 * ChatGateway
 * 
 * Attaches to the same '/notifications' namespace so the client
 * can use a single socket connection.
 */
@WebSocketGateway({ namespace: '/notifications' })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    // We stored userId on the socket during NotificationsGateway connection handshake
    const senderId = (client as any).userId;
    
    if (!senderId) {
      this.logger.warn(`Unauthorized socket attempted to send message: ${client.id}`);
      return;
    }

    try {
      await this.chatService.saveMessage(senderId, payload.receiverId, payload.message);
    } catch (error) {
      this.logger.error(`Error saving chat message: ${error.message}`);
    }
  }
}
