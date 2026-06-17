import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly usersService;
    constructor(notificationsService: NotificationsService, usersService: UsersService);
    getMyFeed(req: any): Promise<import("./notification.entity").Notification[]>;
}
