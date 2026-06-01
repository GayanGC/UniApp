import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@modules/auth/guards';
import { CurrentUser } from '@common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get list of conversations (Inbox)' })
  @ApiResponse({ status: 200, description: 'List of conversations with latest messages.' })
  async getConversations(@CurrentUser('userId') userId: number) {
    return await this.chatService.getConversations(userId);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get historical messages between current user and specified user' })
  @ApiResponse({ status: 200, description: 'List of chat messages.' })
  async getHistory(
    @CurrentUser('userId') currentUserId: number,
    @Param('userId', ParseIntPipe) counterpartId: number,
  ) {
    return await this.chatService.getHistory(currentUserId, counterpartId);
  }
}
