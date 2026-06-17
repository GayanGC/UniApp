import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto';
export declare class ChatGateway {
    private readonly chatService;
    private readonly logger;
    constructor(chatService: ChatService);
    handleSendMessage(client: Socket, payload: SendMessageDto): Promise<void>;
}
