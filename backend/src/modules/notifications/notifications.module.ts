import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AdminNotificationsController } from './admin-notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './notification.entity';
import { UsersModule } from '../users/users.module';

/**
 * NotificationsModule
 *
 * Wires together:
 *  - REST controllers (existing)
 *  - NotificationsGateway (Socket.IO WebSocket)
 *  - NotificationsService (DB persistence)
 *
 * The gateway is exported so other modules (e.g. BoardingModule) can
 * inject it to push real-time events.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule,
    // Provide JwtService inside the gateway for handshake JWT verification
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn', '7d') },
      }),
    }),
  ],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController, AdminNotificationsController],
  // Export gateway so BoardingModule (and others) can call sendToUser()
  exports: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
