import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getConversations(userId: number): Promise<any[]>;
    getHistory(currentUserId: number, counterpartId: number): Promise<import("./entities").ChatMessage[]>;
}
