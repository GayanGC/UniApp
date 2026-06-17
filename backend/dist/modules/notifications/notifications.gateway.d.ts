import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export interface NotificationPayload {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'boarding';
    createdAt: string;
}
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private readonly userSockets;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendToUser(userId: number, payload: NotificationPayload): void;
    broadcastToAll(payload: NotificationPayload): void;
    emitToUser(userId: number, event: string, payload: any): void;
    handlePing(client: Socket, data: any): void;
    private extractUserIdFromHandshake;
}
