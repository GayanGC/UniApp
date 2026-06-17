import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class AdminNotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(dto: CreateNotificationDto, req: any): Promise<import("./notification.entity").Notification>;
}
