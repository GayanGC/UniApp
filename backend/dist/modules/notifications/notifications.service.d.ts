import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsService {
    private notificationsRepository;
    constructor(notificationsRepository: Repository<Notification>);
    createNotification(dto: CreateNotificationDto, userId: number): Promise<Notification>;
    getStudentFeed(studentProfile: {
        university: string;
        faculty: string;
        academic_year: number;
    }): Promise<Notification[]>;
}
