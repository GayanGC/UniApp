import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** Shape of a real-time notification payload emitted to clients */
export interface NotificationPayload {
  id: string;            // client-side deduplication key (uuid)
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'boarding';
  createdAt: string;     // ISO timestamp
}

/**
 * NotificationsGateway
 *
 * Runs on the same port as the HTTP server (NestJS default).
 * Clients connect by passing their JWT in the socket handshake:
 *
 *   io(WS_URL, { auth: { token: 'Bearer <jwt>' } })
 *
 * On successful connection the gateway maps userId → Set<socketId>
 * (a user can have multiple tabs open simultaneously).
 *
 * Public method `sendToUser(userId, payload)` can be called from any
 * service to push a real-time notification to a specific user.
 */
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  /**
   * Maps userId → Set of active socket IDs.
   * One user can have multiple tabs / devices connected simultaneously.
   */
  private readonly userSockets = new Map<number, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('🔌 NotificationsGateway initialised');
  }

  /* ─────────────────────────────────────────────────────────────
     Connection lifecycle
  ───────────────────────────────────────────────────────────── */

  async handleConnection(client: Socket) {
    try {
      const userId = this.extractUserIdFromHandshake(client);
      if (!userId) {
        this.logger.warn(`Socket ${client.id} — no/invalid token; disconnecting`);
        client.disconnect(true);
        return;
      }

      // Register socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Store userId on the socket so we can look it up on disconnect
      (client as any).userId = userId;

      this.logger.log(
        `✅ User ${userId} connected (socket ${client.id}) — active sockets: ${this.userSockets.get(userId)!.size}`,
      );

      // Acknowledge connection to the client
      client.emit('connected', { userId, socketId: client.id });
    } catch (err) {
      this.logger.error(`handleConnection error: ${err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId: number | undefined = (client as any).userId;
    if (userId !== undefined) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(userId);
      }
      this.logger.log(`❌ User ${userId} disconnected (socket ${client.id})`);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     Public API — called by other services
  ───────────────────────────────────────────────────────────── */

  /**
   * Send a real-time notification to a specific user.
   * Safe to call even when the user has no active connections
   * (the event is simply dropped).
   */
  sendToUser(userId: number, payload: NotificationPayload): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.debug(`sendToUser(${userId}) — user not connected; skipping`);
      return;
    }

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit('notification', payload);
    });

    this.logger.log(
      `📨 Notification sent to user ${userId} on ${sockets.size} socket(s): "${payload.title}"`,
    );
  }

  /**
   * Broadcast a notification to ALL connected users.
   * Useful for system-wide announcements.
   */
  broadcastToAll(payload: NotificationPayload): void {
    this.server.emit('notification', payload);
    this.logger.log(`📣 Broadcast notification: "${payload.title}"`);
  }

  /**
   * Emit a generic event with payload to a specific user.
   * Useful for modules (like Chat) that share this namespace.
   */
  emitToUser(userId: number, event: string, payload: any): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) return;

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, payload);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Client → Server events
  ───────────────────────────────────────────────────────────── */

  /**
   * Client can send a ping to verify the connection is alive.
   * Responds with a pong immediately.
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  /* ─────────────────────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────────────────────── */

  private extractUserIdFromHandshake(client: Socket): number | null {
    try {
      // Prefer auth.token, fallback to Authorization header
      const raw: string | undefined =
        client.handshake.auth?.token ??
        client.handshake.headers?.authorization;

      if (!raw) return null;

      const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      const payload = this.jwtService.verify<{ sub?: number; userId?: number }>(token);
      const userId = payload.sub ?? payload.userId;
      return typeof userId === 'number' ? userId : null;
    } catch {
      return null;
    }
  }
}
